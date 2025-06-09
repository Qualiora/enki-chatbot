import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import type { NextRequest } from "next/server"

// Mock user for testing
const mockUserId = "user_123"

// Mock database - in production, use a real database
const chats: any[] = [
  {
    id: "chat_1",
    userId: mockUserId,
    title: "Project Brainstorm",
    messages: [
      { role: "user", content: "Let's brainstorm some ideas." },
      { role: "assistant", content: "Sure! What kind of project?" },
    ],
    createdAt: new Date("2025-06-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2025-06-01T10:05:00Z").toISOString(),
  },
  {
    id: "chat_2",
    userId: mockUserId,
    title: "Daily Journal",
    messages: [
      { role: "user", content: "Today was a good day." },
      {
        role: "assistant",
        content: "That's great to hear! What made it good?",
      },
    ],
    createdAt: new Date("2025-06-02T09:00:00Z").toISOString(),
    updatedAt: new Date("2025-06-05T09:15:00Z").toISOString(),
  },
]

export async function GET() {
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userChats = chats.filter((chat) => chat.userId === mockUserId)
  return NextResponse.json(userChats)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, messages } = await req.json()
  const newChat = {
    id: Date.now().toString(),
    userId: session.user.id,
    title,
    messages,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  chats.push(newChat)
  return NextResponse.json(newChat)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id, messages } = await req.json()
  const chatIndex = chats.findIndex(
    (chat) => chat.id === id && chat.userId === session.user.id
  )

  if (chatIndex === -1) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 })
  }

  chats[chatIndex].messages = messages
  chats[chatIndex].updatedAt = new Date().toISOString()

  return NextResponse.json(chats[chatIndex])
}
