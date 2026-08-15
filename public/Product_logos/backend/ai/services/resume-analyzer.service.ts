import { z } from "zod";
import { aiRouter } from "@/ai/router/ai-provider.router";
import { buildResumeAnalyzerPrompt } from "@/ai/prompts/resume-analyzer.prompt";
import { AppError } from "@/shared/errors";
import { HTTP_STATUS } from "@/shared/constants/http-status";
import type { AIProviderName } from "@/ai/ai.types";
import type { ResumeAnalysisResult } from "@/ai/ai.types";

const resumeAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  suggestions: z.array(z.string()).min(1),
});

function parseJsonResponse(raw: string): unknown {
  // Providers are instructed to return raw JSON, but strip code fences
  // defensively in case a model wraps its output anyway.
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new AppError(
      "The AI provider returned a response that could not be parsed",
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      "AI_RESPONSE_UNPARSEABLE"
    );
  }
}

export const resumeAnalyzerService = {
  async analyze(
    resumeText: string,
    targetRole: string | undefined,
    providerOverride?: AIProviderName
  ): Promise<ResumeAnalysisResult & { provider: AIProviderName }> {
    const messages = buildResumeAnalyzerPrompt(resumeText, targetRole);

    const completion = await aiRouter.complete({ messages, jsonMode: true, temperature: 0.3 }, providerOverride);
    const parsed = parseJsonResponse(completion.content);

    const validated = resumeAnalysisSchema.safeParse(parsed);
    if (!validated.success) {
      throw new AppError(
        "The AI provider returned a response in an unexpected shape",
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        "AI_RESPONSE_INVALID_SHAPE",
        validated.error.flatten()
      );
    }

    return { ...validated.data, provider: completion.provider };
  },
};

export type ResumeAnalyzerService = typeof resumeAnalyzerService;
