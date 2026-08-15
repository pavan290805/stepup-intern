import OpenAI from "openai";
import type { AICompletionOptions, AICompletionResult, AIProvider } from "@/ai/providers/provider.interface";
import { AppError } from "@/shared/errors";
import { HTTP_STATUS } from "@/shared/constants/http-status";

const MODEL = "llama-3.1-70b-versatile";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

/**
 * Groq exposes an OpenAI-compatible chat completions API, so the official
 * `openai` SDK is reused here pointed at Groq's base URL rather than
 * depending on a separate, less mature SDK — a legitimate and common
 * integration pattern for Groq.
 */
export class GroqProvider implements AIProvider {
  readonly name = "groq" as const;
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey, baseURL: GROQ_BASE_URL });
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
        throw new Error("Groq returned an empty completion");
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
