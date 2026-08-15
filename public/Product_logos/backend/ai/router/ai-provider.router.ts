import { env } from "@/config/env";
import { OpenAIProvider } from "@/ai/providers/openai.provider";
import { AnthropicProvider } from "@/ai/providers/anthropic.provider";
import { GeminiProvider } from "@/ai/providers/gemini.provider";
import { GroqProvider } from "@/ai/providers/groq.provider";
import type { AICompletionOptions, AICompletionResult, AIProvider, AIProviderName } from "@/ai/providers/provider.interface";
import { AppError } from "@/shared/errors";
import { HTTP_STATUS } from "@/shared/constants/http-status";

/**
 * Provider Registry + Factory: builds a provider instance on demand from
 * the API key present in the environment. Providers are cached per process
 * once constructed. `ai/services/*` never import a concrete provider class
 * directly — they call `aiRouter.complete()`, and swapping the active
 * provider (or A/B testing two) is a `DEFAULT_AI_PROVIDER` env change.
 */
const providerCache = new Map<AIProviderName, AIProvider>();

function buildProvider(name: AIProviderName): AIProvider {
  const cached = providerCache.get(name);
  if (cached) return cached;

  let provider: AIProvider;

  switch (name) {
    case "openai": {
      if (!env.OPENAI_API_KEY) throw missingKeyError(name);
      provider = new OpenAIProvider(env.OPENAI_API_KEY);
      break;
    }
    case "anthropic": {
      if (!env.ANTHROPIC_API_KEY) throw missingKeyError(name);
      provider = new AnthropicProvider(env.ANTHROPIC_API_KEY);
      break;
    }
    case "gemini": {
      if (!env.GEMINI_API_KEY) throw missingKeyError(name);
      provider = new GeminiProvider(env.GEMINI_API_KEY);
      break;
    }
    case "groq": {
      if (!env.GROQ_API_KEY) throw missingKeyError(name);
      provider = new GroqProvider(env.GROQ_API_KEY);
      break;
    }
  }

  providerCache.set(name, provider);
  return provider;
}

function missingKeyError(name: AIProviderName): AppError {
  return new AppError(
    `AI provider "${name}" is not configured. Set its API key in the environment.`,
    HTTP_STATUS.SERVICE_UNAVAILABLE,
    "AI_PROVIDER_NOT_CONFIGURED"
  );
}

export const aiRouter = {
  /**
   * Resolves the provider to use for this call: an explicit override (for
   * per-feature tuning or A/B tests) takes precedence over the configured
   * platform default (`DEFAULT_AI_PROVIDER`).
   */
  async complete(options: AICompletionOptions, providerOverride?: AIProviderName): Promise<AICompletionResult> {
    const providerName = providerOverride ?? env.DEFAULT_AI_PROVIDER;
    const provider = buildProvider(providerName);
    return provider.complete(options);
  },

  getActiveProviderName(): AIProviderName {
    return env.DEFAULT_AI_PROVIDER;
  },
};

export type AIRouter = typeof aiRouter;
