import { z } from "zod";
import { aiRouter } from "@/ai/router/ai-provider.router";
import { buildJdGeneratorPrompt, type JdGeneratorInput } from "@/ai/prompts/jd-generator.prompt";
import { AppError } from "@/shared/errors";
import { HTTP_STATUS } from "@/shared/constants/http-status";
import type { AIProviderName, JobDescriptionResult } from "@/ai/ai.types";

const jobDescriptionSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  responsibilities: z.array(z.string()).min(1),
  requirements: z.array(z.string()).min(1),
  niceToHave: z.array(z.string()),
});

function parseJsonResponse(raw: string): unknown {
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

export const jdGeneratorService = {
  async generate(
    input: JdGeneratorInput,
    providerOverride?: AIProviderName
  ): Promise<JobDescriptionResult & { provider: AIProviderName }> {
    const messages = buildJdGeneratorPrompt(input);

    const completion = await aiRouter.complete({ messages, jsonMode: true, temperature: 0.5 }, providerOverride);
    const parsed = parseJsonResponse(completion.content);

    const validated = jobDescriptionSchema.safeParse(parsed);
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

export type JdGeneratorService = typeof jdGeneratorService;
