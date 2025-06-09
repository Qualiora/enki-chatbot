"use client"

import { useParams } from "next/navigation"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { LanguageDropdown } from "@/components/language-dropdown"
import { FullscreenToggle } from "@/components/layout/full-screen-toggle"
import { ToggleMobileSidebar } from "@/components/layout/toggle-mobile-sidebar"
import { ModeDropdown } from "@/components/mode-dropdown"
import { UserDropdown } from "@/components/user-dropdown"

export function Header({ dictionary }: { dictionary: DictionaryType }) {
  const params = useParams()

  const locale = params.lang as LocaleType

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-sidebar-border">
      <div className="container flex h-14 justify-between items-center gap-4">
        <ToggleMobileSidebar />
        <div className="grow flex justify-end gap-2">
          <SidebarTrigger className="hidden lg:flex lg:me-auto" />
          <FullscreenToggle />
          <ModeDropdown dictionary={dictionary} />
          <LanguageDropdown dictionary={dictionary} />
          <UserDropdown dictionary={dictionary} locale={locale} />
        </div>
      </div>
    </header>
  )
}
