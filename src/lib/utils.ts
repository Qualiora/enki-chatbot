import { clsx } from "clsx"
import { isToday, isYesterday, subMonths, subWeeks } from "date-fns"
import { twMerge } from "tailwind-merge"

import type { ChatHistoryType, GroupedChatsType } from "@/types"
import type { Chat } from "@prisma/client"
import type { CoreAssistantMessage } from "ai"
import type { ClassValue } from "clsx"
import type { ErrorCode } from "./errors"

import { ChatSDKError } from "./errors"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(fullName: string) {
  if (fullName.length === 0) return ""

  // Split the name by spaces
  const names = fullName.split(" ")
  // Extract the first letter of each name and convert it to uppercase
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("")

  return initials
}

export function ensureWithPrefix(value: string, prefix: string) {
  return value.startsWith(prefix) ? value : `${prefix}${value}`
}

export function ensureWithSuffix(value: string, suffix: string) {
  return value.endsWith(suffix) ? value : `${value}${suffix}`
}

export function ensureWithoutSuffix(value: string, suffix: string) {
  return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value
}

export function ensureWithoutPrefix(value: string, prefix: string) {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value
}

export function ensureRedirectPathname(
  basePathname: string,
  redirectPathname: string
) {
  const searchParams = new URLSearchParams({
    redirectTo: ensureWithoutSuffix(redirectPathname, "/"),
  })

  return ensureWithSuffix(basePathname, "?" + searchParams.toString())
}

export function wait(ms: number = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Retrieve the dictionary value safely
export function getDictionaryValue(
  key: string,
  section: Record<string, unknown>
) {
  const value = section[key]

  if (typeof value !== "string") {
    throw new Error(
      `Invalid dictionary value for key: ${key}. Please ensure all values are correctly set in the dictionary files.`
    )
  }

  return value
}

export function getTrailingMessageId({
  messages,
}: {
  messages: Array<CoreAssistantMessage & { id?: string }>
}) {
  const trailingMessage = messages.at(-1)

  if (!trailingMessage) return null

  return trailingMessage.id
}

export function generateUUID() {
  return crypto.randomUUID()
}

export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  try {
    const response = await fetch(input, init)

    if (!response.ok) {
      const { code, cause } = await response.json()
      throw new ChatSDKError(code as ErrorCode, cause)
    }

    return response
  } catch (error: unknown) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new ChatSDKError("offline:chat")
    }

    throw error
  }
}

export const fetcher = async (url: string) => {
  const response = await fetch(url)

  if (!response.ok) {
    const { code, cause } = await response.json()
    throw new ChatSDKError(code as ErrorCode, cause)
  }

  return response.json()
}

export function getChatHistoryPaginationKey(
  pageIndex: number,
  previousPageData: ChatHistoryType
) {
  const PAGE_SIZE = 20

  if (previousPageData && previousPageData.hasMore === false) {
    return null
  }

  if (pageIndex === 0) return `/api/history?limit=${PAGE_SIZE}`

  const firstChatFromPage = previousPageData.chats.at(-1)

  if (!firstChatFromPage) return null

  return `/api/history?ending_before=${firstChatFromPage.id}&limit=${PAGE_SIZE}`
}

export const groupChatsByDate = (chats: Chat[]): GroupedChatsType => {
  const now = new Date()
  const oneWeekAgo = subWeeks(now, 1)
  const oneMonthAgo = subMonths(now, 1)

  return chats.reduce(
    (groups, chat) => {
      const chatDate = new Date(chat.createdAt)

      if (isToday(chatDate)) {
        groups.today.push(chat)
      } else if (isYesterday(chatDate)) {
        groups.yesterday.push(chat)
      } else if (chatDate > oneWeekAgo) {
        groups.lastWeek.push(chat)
      } else if (chatDate > oneMonthAgo) {
        groups.lastMonth.push(chat)
      } else {
        groups.older.push(chat)
      }

      return groups
    },
    {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    } as GroupedChatsType
  )
}
