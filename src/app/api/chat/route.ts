import { headers } from "next/headers"
import { after } from "next/server"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  smoothStream,
  streamText,
} from "ai"
import { differenceInSeconds } from "date-fns"
import { createResumableStreamContext } from "resumable-stream"

import type { ModelConfigType, ModelType } from "@/types"
import type { Chat } from "@prisma/client"
import type { NextRequest } from "next/server"
import type { ResumableStreamContext } from "resumable-stream"
import type { PostRequestBody } from "./schema"

import { getSession } from "@/lib/auth"
import { isProductionEnvironment } from "@/lib/constants"
import { ChatSDKError } from "@/lib/errors"
import { getModelConfig } from "@/lib/models"
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessagesByChatId,
  getStreamIdsByChatId,
  saveChat,
  saveMessages,
} from "@/lib/queries"
import { getTrailingMessageId } from "@/lib/utils"

import { generateTitleFromUserMessage } from "./actions"
import { postRequestBodySchema } from "./schema"

export const maxDuration = 60

const getModel = (
  provider: string,
  model: string,
  apiKey: string,
  modelConfig: ModelConfigType
) => {
  switch (provider) {
    case "anthropic":
      const anthropic = createAnthropic({ apiKey })
      return anthropic(modelConfig.modelId)
    case "openai":
      const openai = createOpenAI({ apiKey })
      return openai(modelConfig.modelId)
    default:
      const google = createGoogleGenerativeAI({ apiKey })
      return google(modelConfig.modelId)
  }
}

let globalStreamContext: ResumableStreamContext | null = null

function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      })
    } catch (error) {
      if (error instanceof Error && error.message.includes("REDIS_URL")) {
        console.log(
          " > Resumable streams are disabled due to missing REDIS_URL"
        )
      } else {
        console.error(error)
      }
    }
  }

  return globalStreamContext
}

export async function POST(request: NextRequest) {
  let requestBody: PostRequestBody

  try {
    const json = await request.json()
    requestBody = postRequestBodySchema.parse(json)
  } catch {
    return new ChatSDKError("bad_request:api").toResponse()
  }

  try {
    const { id, message, selectedProvider, selectedChatModel } = requestBody

    const session = await getSession()

    if (!session?.user) {
      return new ChatSDKError("unauthorized:chat").toResponse()
    }

    const chat = await getChatById({ id })
    const headersList = await headers()
    const modelConfig = getModelConfig(selectedChatModel as ModelType)

    const apiKey = headersList.get(modelConfig.headerKey) as string

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message,
        model: getModel(
          selectedProvider,
          selectedChatModel,
          apiKey,
          modelConfig
        ),
      })

      await saveChat({
        id,
        userId: session.user.id,
        title,
      })
    } else {
      if (chat.userId !== session.user.id) {
        return new ChatSDKError("forbidden:chat").toResponse()
      }
    }

    const previousMessages = await getMessagesByChatId({ id })

    const messages = appendClientMessage({
      // @ts-expect-error: todo add type conversion from DBMessage[] to UIMessage[]
      messages: previousMessages,
      message,
    })

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: "user",
          parts: message.parts,
          attachments: message.attachments ?? [],
          createdAt: new Date(),
        },
      ],
    })

    const { id: streamId } = await createStreamId({ chatId: id })

    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: getModel(
            selectedProvider,
            selectedChatModel,
            apiKey,
            modelConfig
          ),
          messages,
          maxSteps: 5,
          experimental_transform: smoothStream({ chunking: "word" }),
          onFinish: async ({ response }) => {
            if (session.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === "assistant"
                  ),
                })

                if (!assistantId) {
                  throw new Error("No assistant message found!")
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [message],
                  responseMessages: response.messages,
                })

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      parts: JSON.stringify(assistantMessage.parts ?? []),
                      attachments: JSON.stringify(
                        assistantMessage.experimental_attachments ?? []
                      ),
                      createdAt: new Date(),
                    },
                  ],
                })
              } catch (_) {
                console.error("Failed to save chat")
              }
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text",
          },
        })

        result.consumeStream()

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        })
      },
      onError: () => {
        return "Oops, an error occurred!"
      },
    })

    const streamContext = getStreamContext()

    if (streamContext) {
      return new Response(
        await streamContext.resumableStream(streamId, () => stream)
      )
    } else {
      return new Response(stream)
    }
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse()
    }
  }
}

export async function GET(request: Request) {
  const streamContext = getStreamContext()
  const resumeRequestedAt = new Date()

  if (!streamContext) {
    return new Response(null, { status: 204 })
  }

  const { searchParams } = new URL(request.url)
  const chatId = searchParams.get("chatId")

  if (!chatId) {
    return new ChatSDKError("bad_request:api").toResponse()
  }

  const session = await getSession()

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse()
  }

  let chat: Chat | null

  try {
    chat = await getChatById({ id: chatId })
  } catch {
    return new ChatSDKError("not_found:chat").toResponse()
  }

  if (!chat) {
    return new ChatSDKError("not_found:chat").toResponse()
  }

  if (chat.userId !== session.user.id) {
    return new ChatSDKError("forbidden:chat").toResponse()
  }

  const streamIds = await getStreamIdsByChatId({ chatId })

  if (!streamIds.length) {
    return new ChatSDKError("not_found:stream").toResponse()
  }

  const recentStreamId = streamIds.at(-1)

  if (!recentStreamId) {
    return new ChatSDKError("not_found:stream").toResponse()
  }

  const emptyDataStream = createDataStream({
    execute: () => {},
  })

  const stream = await streamContext.resumableStream(
    recentStreamId,
    () => emptyDataStream
  )

  /*
   * For when the generation is streaming during SSR
   * but the resumable stream has concluded at this point.
   */
  if (!stream) {
    const messages = await getMessagesByChatId({ id: chatId })
    const mostRecentMessage = messages.at(-1)

    if (!mostRecentMessage) {
      return new Response(emptyDataStream, { status: 200 })
    }

    if (mostRecentMessage.role !== "assistant") {
      return new Response(emptyDataStream, { status: 200 })
    }

    const messageCreatedAt = new Date(mostRecentMessage.createdAt)

    if (differenceInSeconds(resumeRequestedAt, messageCreatedAt) > 15) {
      return new Response(emptyDataStream, { status: 200 })
    }

    const restoredStream = createDataStream({
      execute: (buffer) => {
        buffer.writeData({
          type: "append-message",
          message: JSON.stringify(mostRecentMessage),
        })
      },
    })

    return new Response(restoredStream, { status: 200 })
  }

  return new Response(stream, { status: 200 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return new ChatSDKError("bad_request:api").toResponse()
  }

  const session = await getSession()

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse()
  }

  const chat = await getChatById({ id })

  if (!chat) {
    return new ChatSDKError("not_found:chat").toResponse()
  }

  if (chat.userId !== session.user.id) {
    return new ChatSDKError("forbidden:chat").toResponse()
  }

  const deletedChat = await deleteChatById({ id })

  return Response.json(deletedChat, { status: 200 })
}
