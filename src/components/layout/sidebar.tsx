"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Plus } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { GroupedChatsType, LocaleType } from "@/types"

import { i18n } from "@/configs/i18n"
import { ensureLocalizedPathname } from "@/lib/i18n"

import { buttonVariants } from "@/components/ui/button"
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
import { CommandMenu } from "./command-menu"

export function Sidebar({
  dictionary,
  chatsGrouped,
}: {
  dictionary: DictionaryType
  chatsGrouped?: GroupedChatsType
}) {
  const params = useParams()

  const threadId = params.threadId
  const locale = params.lang as LocaleType
  const direction = i18n.localeDirection[locale]
  const isRTL = direction === "rtl"

  return (
    <SidebarWrapper side={isRTL ? "right" : "left"}>
      <SidebarHeader className="py-3 border-b">
        <Link href="/" className="w-fit font-semibold text-xl mx-auto">
          Enki Chatbot
        </Link>
        <Link href="/chat" className={buttonVariants({ size: "lg" })}>
          <Plus className="me-2 w-4 h-4" />
          <span>New Chat</span>
        </Link>
        <CommandMenu dictionary={dictionary} chatsGrouped={chatsGrouped} />
      </SidebarHeader>

      <SidebarContent>
        {chatsGrouped?.sortedKeys.map((groupLabel) => (
          <SidebarGroup key={groupLabel}>
            <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chatsGrouped.grouped[groupLabel].map((chat) => {
                  const localizedPathname = ensureLocalizedPathname(
                    "/chat/" + chat.id,
                    locale
                  )
                  const isActive = threadId === chat.id

                  return (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton isActive={isActive} asChild>
                        <Link href={localizedPathname}>{chat.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </SidebarWrapper>
  )
}
