import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AICompletionOptions, AICompletionResult, AIProvider } from "@/ai/providers/provider.interface";
import { AppError } from "@/shared/errors";
import { HTTP_STATUS } from "@/shared/constants/http-status";

const MODEL = "gemini-1.5-flash";

export class GeminiProvider implements AIProvider {
  readonly name = "gemini" as const;
  private readonly client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async complete(options: AICompletionOptions): Promise<AICompletionResult> {
    try {
      const systemMessage = options.messages.find((m) => m.role === "system")?.content;

      const model = this.client.getGenerativeModel({
        model: MODEL,
        systemInstruction: systemMessage,
        generationConfig: {
          temperature: options.temperature ?? 0.4,
          maxOutputTokens: options.maxTokens ?? 1024,
          ...(options.jsonMode ? { responseMimeType: "application/json" } : {}),
        },
      });

      const conversation = options.messages
        .filter((m) => m.role !== "system")
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
        .join("\n\n");

      const result = await model.generateContent(conversation);
      const content = result.response.text();

      if (!content) {
        throw new Error("Gemini returned an empty completion");
      }

      return { content, provider: this.name, model: MODEL };
    } catch (error) {
      throw new AppError(
        "The AI provider failed to generate a response. Please try again.",
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        "AI_PROVIDER_ERROR",
        error instanceof Error ? error.message : undefined
      );
    }
  }
}
