import { simulateReadableStream } from "ai"
import { MockLanguageModelV1 } from "ai/test"

export const chatModel = new MockLanguageModelV1({
  doGenerate: async () => ({
    rawCall: { rawPrompt: null, rawSettings: {} },
    finishReason: "stop",
    usage: { promptTokens: 10, completionTokens: 20 },
    text: `Hello, world!`,
  }),
  doStream: async () => ({
    stream: simulateReadableStream({
      chunkDelayInMs: 500,
      initialDelayInMs: 1000,
      chunks: [
        { type: "text-delta", textDelta: "This is a " },
        { type: "text-delta", textDelta: "simulated chat " },
        { type: "text-delta", textDelta: "response based on your prompt: " },
        {
          type: "finish",
          finishReason: "stop",
          logprobs: undefined,
          usage: { completionTokens: 25, promptTokens: 15 },
        },
      ],
    }),
    rawCall: { rawPrompt: null, rawSettings: {} },
  }),
})

export const reasoningModel = new MockLanguageModelV1({
  doGenerate: async () => ({
    rawCall: { rawPrompt: null, rawSettings: {} },
    finishReason: "stop",
    usage: { promptTokens: 10, completionTokens: 20 },
    text: `Hello, world!`,
  }),
  doStream: async () => ({
    stream: simulateReadableStream({
      chunkDelayInMs: 500,
      initialDelayInMs: 1000,
      chunks: [
        { type: "text-delta", textDelta: "Based on the input, " },
        { type: "text-delta", textDelta: "the reasoning is as follows: " },
        { type: "text-delta", textDelta: "Step 1: Analyze the request. " },
        { type: "text-delta", textDelta: "Step 2: Formulate a response. " },
        { type: "text-delta", textDelta: "Step 3: Conclude." },
        {
          type: "finish",
          finishReason: "stop",
          logprobs: undefined,
          usage: { promptTokens: 12, completionTokens: 30 },
        },
      ],
    }),
    rawCall: { rawPrompt: null, rawSettings: {} },
  }),
})

export const titleModel = new MockLanguageModelV1({
  doGenerate: async () => ({
    rawCall: { rawPrompt: null, rawSettings: {} },
    finishReason: "stop",
    usage: { promptTokens: 10, completionTokens: 20 },
    text: `This is a test title`,
  }),
  doStream: async () => ({
    stream: simulateReadableStream({
      chunkDelayInMs: 500,
      initialDelayInMs: 1000,
      chunks: [
        { type: "text-delta", textDelta: "This is a test title" },
        {
          type: "finish",
          finishReason: "stop",
          logprobs: undefined,
          usage: { completionTokens: 10, promptTokens: 3 },
        },
      ],
    }),
    rawCall: { rawPrompt: null, rawSettings: {} },
  }),
})
