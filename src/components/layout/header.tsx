import type { DictionaryType } from "@/lib/get-dictionary"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { LanguageDropdown } from "@/components/language-dropdown"
import { ModeDropdown } from "@/components/mode-dropdown"
import { UserDropdown } from "@/components/user-dropdown"

export function Header({ dictionary }: { dictionary: DictionaryType }) {
  return (
    <header className="sticky top-0 z-50 h-14 w-full flex justify-end items-center gap-2 px-4 bg-background border-b border-sidebar-border">
      <SidebarTrigger className="me-auto" />
      <ModeDropdown dictionary={dictionary} />
      <LanguageDropdown dictionary={dictionary} />
      <UserDropdown dictionary={dictionary} />
    </header>
  )
}
