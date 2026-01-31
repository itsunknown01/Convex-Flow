import { AiProvider, AiRequest, AiOutput } from "../ai-types.js";

export class MockProvider implements AiProvider {
  async generate(
    req: AiRequest,
  ): Promise<{ output: AiOutput; tokensUsed: number; latencyMs: number }> {
    // Simulate latency
    await new Promise((r) => setTimeout(r, 500));

    const isUncertain = req.prompt.toLowerCase().includes("uncertain");

    return {
      output: {
        summary: "Mock AI Response",
        explanation: "This is a deterministic mock response for testing.",
        confidence: isUncertain ? 0.5 : 0.99,
        data: {
          originalPrompt: req.prompt,
          mocked: true,
        },
      },
      tokensUsed: 42,
      latencyMs: 500,
    };
  }
}
