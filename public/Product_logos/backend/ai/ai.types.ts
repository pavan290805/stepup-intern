export type AIProviderName = "openai" | "anthropic" | "gemini" | "groq";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AICompletionOptions {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  /** When true, providers are instructed to return raw JSON with no prose wrapper. */
  jsonMode?: boolean;
}

export interface AICompletionResult {
  content: string;
  provider: AIProviderName;
  model: string;
}

/**
 * Every provider (OpenAI, Anthropic, Gemini, Groq) implements this single
 * interface. Business logic (ai/services/*) depends only on this contract —
 * never on a concrete SDK — so swapping or A/B-testing providers is a
 * configuration change in ai/router/ai-provider.router.ts, not a rewrite.
 */
export interface AIProvider {
  readonly name: AIProviderName;
  complete(options: AICompletionOptions): Promise<AICompletionResult>;
}

export interface ResumeAnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface JobDescriptionResult {
  title: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
}
