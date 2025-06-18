import "server-only"

import type { Prisma } from "@prisma/client"

import { ChatSDKError } from "@/lib/errors"
import { db } from "@/lib/prisma"

export async function getUser(email: string) {
  try {
    return await db.user.findUnique({ where: { email } })
  } catch {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user by email"
    )
  }
}

export async function saveChat({
  id,
  userId,
  title,
}: Prisma.ChatUncheckedCreateInput) {
  try {
    return await db.chat.create({ data: { id, userId, title } })
  } catch {
    throw new ChatSDKError("bad_request:database", "Failed to save chat")
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.message.deleteMany({ where: { chatId: id } })
    await db.stream.deleteMany({ where: { chatId: id } })
    return await db.chat.delete({ where: { id } })
  } catch {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete chat by id"
    )
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string
  limit: number
  startingAfter: string | null
  endingBefore: string | null
}) {
  try {
    const take = limit + 1
    const cursor = startingAfter
      ? { id: startingAfter }
      : endingBefore
        ? { id: endingBefore }
        : undefined

    const order = { createdAt: "desc" as const }

    const chats = await db.chat.findMany({
      where: { userId: id },
      orderBy: order,
      cursor,
      take: startingAfter ? take : undefined,
      skip: startingAfter || endingBefore ? 1 : undefined,
      ...(endingBefore && { take: -take }),
    })

    const hasMore = chats.length > limit
    const result = hasMore ? chats.slice(0, limit) : chats

    return { chats: result, hasMore }
  } catch {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get chats by user id"
    )
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    return await db.chat.findUnique({ where: { id } })
  } catch {
    throw new ChatSDKError("bad_request:database", "Failed to get chat by id")
  }
}

export async function saveMessages({
  messages,
}: {
  messages: Prisma.MessageCreateManyInput[]
}) {
  try {
    return await db.message.createMany({ data: messages })
  } catch {
    throw new ChatSDKError("bad_request:database", "Failed to save messages")
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    const rawMessages = await db.message.findMany({
      where: { chatId: id },
      orderBy: { createdAt: "asc" },
    })

    // Map over the raw messages to parse the JSON strings
    const parsedMessages = rawMessages.map((msg) => {
      const parsedParts =
        typeof msg.parts === "string" ? JSON.parse(msg.parts) : msg.parts
      const parsedAttachments =
        typeof msg.attachments === "string"
          ? JSON.parse(msg.attachments)
          : msg.attachments

      return {
        ...msg,
        parts: parsedParts,
        attachments: parsedAttachments,
      }
    })

    return parsedMessages
  } catch {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get messages by chat id"
    )
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.message.findUnique({ where: { id } })
  } catch {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message by id"
    )
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string
  timestamp: Date
}) {
  try {
    const messagesToDelete = await db.message.findMany({
      where: {
        chatId,
        createdAt: {
          gte: timestamp,
        },
      },
      select: {
        id: true,
      },
    })

    const messageIds = messagesToDelete.map((message) => message.id)

    if (messageIds.length > 0) {
      // Delete the messages themselves
      return await db.message.deleteMany({
        where: {
          chatId,
          id: {
            in: messageIds,
          },
        },
      })
    }
  } catch {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete messages by chat id after timestamp"
    )
  }
}

export async function createStreamId({ chatId }: { chatId: string }) {
  try {
    return await db.stream.create({ data: { chatId } })
  } catch {
    throw new ChatSDKError("bad_request:database", "Failed to create stream id")
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    const streams = await db.stream.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    })
    return streams.map((s) => s.id)
  } catch {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get stream ids by chat id"
    )
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string
  differenceInHours: number
}) {
  try {
    const since = new Date(Date.now() - differenceInHours * 3600_000)
    return await db.message.count({
      where: {
        chat: { userId: id },
        role: "user",
        createdAt: { gte: since },
      },
    })
  } catch {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message count by user id"
    )
  }
}
