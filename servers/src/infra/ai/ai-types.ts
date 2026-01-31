import { z } from "zod";

// Valid Output Schema: All AI outputs must match this!
export const AiOutputSchema = z.object({
  summary: z.string(),
  explanation: z.string(),
  confidence: z.number().min(0).max(1),
  data: z.any(),
});

export type AiOutput = z.infer<typeof AiOutputSchema>;

export interface AiRequest {
  tenantId: string;
  model: string;
  prompt: string;
  systemConfig?: any;
}

export interface AiProvider {
  generate(req: AiRequest): Promise<{
    output: AiOutput;
    tokensUsed: number;
    latencyMs: number;
  }>;
}
