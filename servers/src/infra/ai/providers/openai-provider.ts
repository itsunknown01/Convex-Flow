import OpenAI from "openai";
import { AiProvider, AiRequest, AiOutput } from "../ai-types.js";

export class OpenAiProvider implements AiProvider {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn(
        "[OpenAiProvider] OPENAI_API_KEY not found. AI features will fail.",
      );
    }
    this.openai = new OpenAI({ apiKey: apiKey || "dummy-key" });
  }

  async generate(req: AiRequest): Promise<{
    output: AiOutput;
    tokensUsed: number;
    latencyMs: number;
  }> {
    const startTime = Date.now();

    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey || apiKey === "My API Key" || !apiKey.startsWith("sk-")) {
        return {
          output: {
            summary: "Mock AI Summary",
            explanation: "Mock AI Explanation (No API Key)",
            confidence: req.prompt.includes("uncertain") ? 0.3 : 0.95,
            data: { result: "mock_success" },
          },
          tokensUsed: 10,
          latencyMs: 10,
        };
      }

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // Using 4o for best structured output performance
        messages: [
          {
            role: "system",
            content: `You are a workflow reasoning engine. You must return result in valid JSON format.
Expected Schema:
{
  "summary": "Short action description",
  "explanation": "Detailed reasoning",
  "confidence": 0-1 float,
  "output": { ... any valid JSON result ... }
}`,
          },
          { role: "user", content: req.prompt },
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]!.message.content || "{}";
      const parsed = JSON.parse(content);
      const latencyMs = Date.now() - startTime;

      return {
        output: parsed, // This must match AiOutputSchema
        tokensUsed: response.usage?.total_tokens || 0,
        latencyMs,
      };
    } catch (error: any) {
      console.error("[OpenAiProvider] Error:", error);
      throw new Error(`AI Generation failed: ${error.message}`);
    }
  }
}
