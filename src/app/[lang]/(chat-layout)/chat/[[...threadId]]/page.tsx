import { ChatInterface } from "@/components/chat-interface"

export default async function ChatPage(props: {
  params: Promise<{ threadId: string[] }>
}) {
  const params = await props.params
  const threadId = params.threadId?.[0]

  return (
    <section className="container p-4">
      <ChatInterface chatId={threadId} />
    </section>
  )
}
