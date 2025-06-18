"use client"

import { memo } from "react"
import Link from "next/link"
import { Trash } from "lucide-react"

import type { LocaleType } from "@/types"
import type { Chat } from "@prisma/client"

import { ensureLocalizedPathname } from "@/lib/i18n"

import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export const ThreadItem = memo(
  ({
    thread,
    isActive,
    onDelete,
    setOpenMobile,
    locale,
  }: {
    thread: Chat
    isActive: boolean
    onDelete: (threadId: string) => void
    setOpenMobile: (open: boolean) => void
    locale: LocaleType
  }) => {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link
            href={ensureLocalizedPathname(`/chat/${thread.id}`, locale)}
            onClick={() => setOpenMobile(false)}
          >
            <span className="flex-1 w-0 break-all truncate">
              {thread.title}
            </span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuAction
          className="hover:text-destructive me-0.5"
          showOnHover
          onClick={() => onDelete(thread.id)}
        >
          <Trash />
          <span className="sr-only">Delete</span>
        </SidebarMenuAction>
      </SidebarMenuItem>
    )
  },
  (prevProps, nextProps) => {
    if (prevProps.isActive !== nextProps.isActive) return false
    return true
  }
)
ThreadItem.displayName = "ThreadItem"
