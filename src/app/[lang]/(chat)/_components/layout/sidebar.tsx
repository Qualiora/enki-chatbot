"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"

import { useIsRtl } from "@/hooks/use-is-rtl"
import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  SidebarContent,
  SidebarHeader,
  Sidebar as SidebarWrapper,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { CommandMenu } from "./command-menu"
import { SidebarHistory } from "./sidebar-history"

export function Sidebar({ dictionary }: { dictionary: DictionaryType }) {
  const isRTL = useIsRtl()

  return (
    <SidebarWrapper side={isRTL ? "right" : "left"}>
      <SidebarHeader className="py-3 border-b">
        <Logo className="mx-auto" />
        <Link href="/chat" className={buttonVariants({ size: "lg" })}>
          <Plus className="me-2 w-4 h-4" />
          <span>New Chat</span>
        </Link>
        <CommandMenu dictionary={dictionary} />
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          <SidebarHistory />
        </ScrollArea>
      </SidebarContent>
    </SidebarWrapper>
  )
}
