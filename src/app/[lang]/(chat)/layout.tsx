import { headers } from "next/headers"
import {
  differenceInCalendarDays,
  format,
  isToday,
  isYesterday,
} from "date-fns"

import type { ChatType, GroupedChatsType, LocaleType } from "@/types"
import type { ReactNode } from "react"

import { getDictionary } from "@/lib/get-dictionary"

import { Layout } from "@/app/[lang]/(chat)/_components/layout"

function getDateGroupLabel(date: Date): string {
  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"

  const diff = differenceInCalendarDays(new Date(), date)
  if (diff === 2) return "2 days ago"
  if (diff === 3) return "3 days ago"
  if (diff <= 7) return `${diff} days ago`
  if (diff <= 14) return "Last week"
  if (diff <= 21) return "2 weeks ago"
  return format(date, "MMMM d, yyyy")
}

export async function getChatsGrouped(): Promise<GroupedChatsType | undefined> {
  try {
    const incomingHeaders = await headers()
    const baseUrl = process.env.BASE_URL

    const response = await fetch(`${baseUrl}/api/chats`, {
      headers: incomingHeaders,
    })

    if (!response.ok) return

    const chats: ChatType[] = await response.json()

    // Group the chats
    const grouped: Record<string, ChatType[]> = {}

    for (const chat of chats) {
      const date = new Date(chat.updatedAt)
      const label = getDateGroupLabel(date)
      if (!grouped[label]) grouped[label] = []
      grouped[label].push(chat)
    }

    // Sort chats within each group
    for (const group in grouped) {
      grouped[group].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    }

    // Sort the group keys by the most recent chat in each group
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const aDate = new Date(grouped[a][0].updatedAt)
      const bDate = new Date(grouped[b][0].updatedAt)
      return bDate.getTime() - aDate.getTime()
    })

    return { sortedKeys, grouped }
  } catch (error) {
    console.error("Failed to fetch chats:", error)
  }
}

export default async function DashboardLayout(props: {
  children: ReactNode
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params

  const { children } = props

  const dictionary = await getDictionary(params.lang)
  const chatsGrouped = await getChatsGrouped()

  return (
    <Layout dictionary={dictionary} chatsGrouped={chatsGrouped}>
      {children}
    </Layout>
  )
}
