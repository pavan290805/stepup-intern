export type AIProviderName = "openai" | "anthropic" | "gemini" | "groq";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AICompletionOptions {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface AICompletionResult {
  content: string;
  provider: AIProviderName;
  model: string;
}

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
