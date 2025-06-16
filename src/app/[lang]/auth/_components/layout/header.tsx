import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"

import { LanguageDropdown } from "@/components/language-dropdown"
import { Logo } from "@/components/logo"

export function Header({
  dictionary,
  locale,
}: {
  dictionary: DictionaryType
  locale: LocaleType
}) {
  return (
    <header className="sticky top-0 z-50 h-14 w-full flex justify-between items-center gap-2 px-4 bg-background border-b border-sidebar-border">
      <Logo href={ensureLocalizedPathname("/", locale)} />
      <LanguageDropdown dictionary={dictionary} />
    </header>
  )
}
