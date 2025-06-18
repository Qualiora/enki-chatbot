import type { ModelConfigType, ModelType } from "@/types"

export const providers = [
  "google",
  "openrouter",
  "openai",
  "anthropic",
] as const

export const models = [
  "Deepseek R1 0528",
  "Deepseek V3",
  "Gemini 2.5 Pro",
  "Gemini 2.5 Flash",
  "GPT-4o",
  "GPT-4.1-mini",
  "Claude 4 Sonnet",
] as const

export const modelConfigs = {
  "Deepseek R1 0528": {
    modelId: "deepseek/deepseek-r1-0528:free",
    provider: "openrouter",
    headerKey: "X-OpenRouter-API-Key",
  },
  "Deepseek V3": {
    modelId: "deepseek/deepseek-chat-v3-0324:free",
    provider: "openrouter",
    headerKey: "X-OpenRouter-API-Key",
  },
  "Gemini 2.5 Pro": {
    modelId: "gemini-2.5-pro-preview-05-06",
    provider: "google",
    headerKey: "X-Google-API-Key",
  },
  "Gemini 2.5 Flash": {
    modelId: "gemini-2.5-flash-preview-04-17",
    provider: "google",
    headerKey: "X-Google-API-Key",
  },
  "GPT-4o": {
    modelId: "gpt-4o",
    provider: "openai",
    headerKey: "X-OpenAI-API-Key",
  },
  "GPT-4.1-mini": {
    modelId: "gpt-4.1-mini",
    provider: "openai",
    headerKey: "X-OpenAI-API-Key",
  },
  "Claude 4 Sonnet": {
    modelId: "claude-sonnet-4-20250514",
    provider: "anthropic",
    headerKey: "X-Anthropic-API-Key",
  },
} as const satisfies Record<ModelType, ModelConfigType>
