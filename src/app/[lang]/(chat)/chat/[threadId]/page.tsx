import { notFound } from "next/navigation"

import type { Message } from "@prisma/client"
import type { UIMessage } from "ai"

import { getChatById, getMessagesByChatId } from "@/lib/queries"

import { Thread } from "@/app/[lang]/(chat)/chat/_components/thread"

export default async function ThreadPage(props: {
  params: Promise<{ threadId: string }>
}) {
  const { threadId } = await props.params
  const chat = await getChatById({ id: threadId })

  if (!chat) {
    notFound()
  }

  const messagesFromDb = await getMessagesByChatId({
    id: threadId,
  })

  function convertToUIMessages(messages: Array<Message>): Array<UIMessage> {
    return messages.map((message) => ({
      id: message.id,
      parts: message.parts as UIMessage["parts"],
      role: message.role as UIMessage["role"],
      // Note: content will soon be deprecated in @ai-sdk/react
      content: "",
      createdAt: message.createdAt,
      attachments: message.attachments ?? [],
    }))
  }

  return (
    <Thread
      threadId={threadId}
      initialMessages={convertToUIMessages(messagesFromDb)}
      autoResume={false}
    />
  )
}
