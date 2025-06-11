import { Thread } from "@/components/thread"

export default async function ChatPage() {
  return <Thread threadId={crypto.randomUUID()} initialMessages={[]} />
}
