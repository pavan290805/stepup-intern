import OpenAI from "openai";
import type { AICompletionOptions, AICompletionResult, AIProvider } from "@/ai/providers/provider.interface";
import { AppError } from "@/shared/errors";
import { HTTP_STATUS } from "@/shared/constants/http-status";

const MODEL = "gpt-4o-mini";

export class OpenAIProvider implements AIProvider {
  readonly name = "openai" as const;
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async complete(options: AICompletionOptions): Promise<AICompletionResult> {
    try {
      const response = await this.client.chat.completions.create({
        model: MODEL,
        messages: options.messages,
        temperature: options.temperature ?? 0.4,
        max_tokens: options.maxTokens ?? 1024,
        ...(options.jsonMode ? { response_format: { type: "json_object" as const } } : {}),
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("OpenAI returned an empty completion");
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
