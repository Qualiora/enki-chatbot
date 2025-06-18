"use server"

import { cookies } from "next/headers"
import { generateText } from "ai"

import type { ModelType } from "@/types"
import type { LanguageModelV1, UIMessage } from "ai"

import { isDevelopmentEnvironment } from "@/lib/constants"
import { titleModel } from "@/lib/mock-models."
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
} from "@/lib/queries"

export async function saveChatModelAsCookie(model: ModelType) {
  const cookieStore = await cookies()
  cookieStore.set("chat-model", model)
}

export async function generateTitleFromUserMessage({
  message,
  model,
}: {
  message: UIMessage
  model: LanguageModelV1
}) {
  const { text: title } = await generateText({
    model: isDevelopmentEnvironment ? titleModel : model,
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  })

  return title
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const message = await getMessageById({ id })

  if (message) {
    await deleteMessagesByChatIdAfterTimestamp({
      chatId: message.chatId,
      timestamp: message.createdAt,
    })
  }
}
