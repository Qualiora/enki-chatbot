import type { UIMessage } from "ai"

import { Thread } from "@/components/thread"

export default async function ChatPage(props: {
  params: Promise<{ threadId: string }>
}) {
  const { threadId } = await props.params
  const initialMessages: UIMessage[] = [
    {
      id: crypto.randomUUID(),
      role: "user",
      content: "Today was a good day.",
      parts: [{ type: "text", text: "Today was a good day." }],
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "That's great to hear! What made it good?",
      parts: [
        { type: "text", text: "That's great to hear! What made it good?" },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "user",
      content: "Today was a good day.",
      parts: [{ type: "text", text: "Today was a good day." }],
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "That's great to hear! What made it good?",
      parts: [
        { type: "text", text: "That's great to hear! What made it good?" },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "user",
      content: "Today was a good day.",
      parts: [{ type: "text", text: "Today was a good day." }],
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "That's great to hear! What made it good?",
      parts: [
        { type: "text", text: "That's great to hear! What made it good?" },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "user",
      content: "Today was a good day.",
      parts: [{ type: "text", text: "Today was a good day." }],
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "That's great to hear! What made it good?",
      parts: [
        { type: "text", text: "That's great to hear! What made it good?" },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "user",
      content: "Today was a good day.",
      parts: [{ type: "text", text: "Today was a good day." }],
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "That's great to hear! What made it good?",
      parts: [
        { type: "text", text: "That's great to hear! What made it good?" },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "user",
      content: "Today was a good day.",
      parts: [{ type: "text", text: "Today was a good day." }],
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "That's great to hear! What made it good?",
      parts: [
        { type: "text", text: "That's great to hear! What made it good?" },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "user",
      content: "Today was a good day.",
      parts: [{ type: "text", text: "Today was a good day." }],
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "That's great to hear! What made it good?",
      parts: [
        { type: "text", text: "That's great to hear! What made it good?" },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "user",
      content: "Today was a good day.",
      parts: [{ type: "text", text: "Today was a good day." }],
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "That's great to hear! What made it good?",
      parts: [
        { type: "text", text: "That's great to hear! What made it good?" },
      ],
    },
  ]

  return <Thread threadId={threadId} initialMessages={initialMessages} />
}
