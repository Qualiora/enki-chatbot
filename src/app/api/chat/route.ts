import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { getServerSession } from "next-auth"

import type { NextRequest } from "next/server"

export const maxDuration = 30

const getModel = (provider: string, model: string) => {
  switch (provider) {
    case "openai":
      return openai(model)
    case "anthropic":
      return anthropic(model)
    case "google":
      return google(model)
    default:
      return openai("gpt-4o")
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, provider = "openai", model = "gpt-4o" } = await req.json()

    const session = await getServerSession()
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const selectedModel = getModel(provider, model)

    const result = streamText({
      model: selectedModel,
      messages,
      temperature: 0.7,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
