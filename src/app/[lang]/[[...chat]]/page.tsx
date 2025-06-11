import { notFound } from "next/navigation"

import { ChatInterface } from "@/components/chat-interface"

export default async function ChatPage(props: {
  params: Promise<{ chat: string[] }>
}) {
  const params = await props.params
  const chatType = params.chat?.[0]
  const threadId = params.chat?.[1]

  switch (chatType) {
    case "chat":
      return <ChatInterface chatId={threadId} />
    default:
      return notFound()
  }
}
