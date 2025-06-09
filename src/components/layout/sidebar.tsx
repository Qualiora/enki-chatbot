"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  differenceInCalendarDays,
  format,
  isToday,
  isYesterday,
} from "date-fns"
import { Plus, Sparkles } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { i18n } from "@/configs/i18n"
import { ensureLocalizedPathname } from "@/lib/i18n"

import { Button } from "@/components/ui/button"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarWrapper,
} from "@/components/ui/sidebar"

interface Chat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

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

export function Sidebar({ dictionary }: { dictionary: DictionaryType }) {
  const { threadId } = useParams()
  const params = useParams()

  const locale = params.lang as LocaleType
  const direction = i18n.localeDirection[locale]
  const isRTL = direction === "rtl"
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats")
      if (response.ok) {
        const data = await response.json()
        setChats(data)
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error)
    } finally {
      setLoading(false)
    }
  }

  const groupedChats = chats.reduce<Record<string, Chat[]>>((acc, chat) => {
    const date = new Date(chat.updatedAt)
    const label = getDateGroupLabel(date)
    if (!acc[label]) acc[label] = []
    acc[label].push(chat)
    return acc
  }, {})

  const sortedGroupKeys = Object.keys(groupedChats).sort((a, b) => {
    const aDate = new Date(groupedChats[a][0].updatedAt)
    const bDate = new Date(groupedChats[b][0].updatedAt)
    return bDate.getTime() - aDate.getTime()
  })

  return (
    <SidebarWrapper side={isRTL ? "right" : "left"}>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg">Enki Chatbot</span>
        </div>
        <Button size="lg">
          <Plus className="me-2 w-4 h-4" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        {loading ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            Loading chats...
          </div>
        ) : sortedGroupKeys.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            No chats yet
          </div>
        ) : (
          sortedGroupKeys.map((groupLabel) => (
            <SidebarGroup key={groupLabel}>
              <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupedChats[groupLabel]
                    .sort(
                      (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    )
                    .map((chat) => (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton
                          isActive={threadId === chat.id}
                          asChild
                        >
                          <Link
                            href={ensureLocalizedPathname(
                              "/chat/" + chat.id,
                              locale
                            )}
                          >
                            {chat.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
    </SidebarWrapper>
  )
}
