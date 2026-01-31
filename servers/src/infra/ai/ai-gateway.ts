import { db } from "@workspace/database";
import { connection } from "../queue/queue-factory.js";
import { AiProvider, AiRequest, AiOutputSchema, AiOutput } from "./ai-types.js";
import { OpenAiProvider } from "./providers/openai-provider.js";
import { LedgerService } from "../ledger/ledger-service.js";
import { CircuitBreaker } from "../../utils/circuit-breaker.js";

export class AiGateway {
  private static instance: AiGateway;
  private provider: AiProvider;
  private breaker: CircuitBreaker;

  private constructor() {
    this.provider = new OpenAiProvider(); // Using real OpenAI provider
    this.breaker = new CircuitBreaker(5, 30000);
  }

  public static getInstance(): AiGateway {
    if (!AiGateway.instance) {
      AiGateway.instance = new AiGateway();
    }
    return AiGateway.instance;
  }

  public async generate(req: AiRequest): Promise<AiOutput> {
    // 1. Rate Limiting (100 reqs/min per tenant)
    const rateLimitKey = `rate_limit:ai:${req.tenantId}`;
    const currentUsage = await connection.incr(rateLimitKey);
    if (currentUsage === 1) {
      await connection.expire(rateLimitKey, 60);
    }

    if (currentUsage > 100) {
      throw new Error(`Rate limit exceeded for tenant ${req.tenantId}`);
    }

    // 2. Inference (Wrapped in Circuit Breaker)
    const result = await this.breaker.fire(() => this.provider.generate(req));

    // 3. Validation
    const parsed = AiOutputSchema.safeParse(result.output);
    if (!parsed.success) {
      throw new Error(
        "AI Provider returned invalid schema: " + parsed.error.message,
      );
    }

    // 4. Audit Logging
    await db.aiRequestLog.create({
      data: {
        tenantId: req.tenantId,
        model: req.model,
        prompt: req.prompt,
        response: result.output,
        tokensUsed: result.tokensUsed,
        latencyMs: result.latencyMs,
        statusCode: 200,
      },
    });

    const ledger = LedgerService.getInstance();
    await ledger.append(req.tenantId, "AI_GENERATION", {
      model: req.model,
      prompt: req.prompt,
      response: result.output,
    });

    return parsed.data;
  }
}
