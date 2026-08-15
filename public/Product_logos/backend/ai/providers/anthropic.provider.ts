import Anthropic from "@anthropic-ai/sdk";
import type { AICompletionOptions, AICompletionResult, AIProvider } from "@/ai/providers/provider.interface";
import { AppError } from "@/shared/errors";
import { HTTP_STATUS } from "@/shared/constants/http-status";

const MODEL = "claude-3-5-sonnet-20241022";

export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic" as const;
  private readonly client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async complete(options: AICompletionOptions): Promise<AICompletionResult> {
    try {
      const systemMessage = options.messages.find((m) => m.role === "system")?.content;
      const conversationMessages = options.messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

      const jsonInstruction = options.jsonMode
        ? "\n\nRespond with raw JSON only. Do not include markdown code fences or any prose outside the JSON object."
        : "";

      const response = await this.client.messages.create({
        model: MODEL,
        max_tokens: options.maxTokens ?? 1024,
        temperature: options.temperature ?? 0.4,
        system: systemMessage ? `${systemMessage}${jsonInstruction}` : undefined,
        messages: conversationMessages,
      });

      const textBlock = response.content.find((block) => block.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("Anthropic returned no text content");
      }

      return { content: textBlock.text, provider: this.name, model: MODEL };
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
