"use client"

import { useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Earth } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { i18n } from "@/configs/i18n"
import { relocalizePathname } from "@/lib/i18n"
import { getDictionaryValue } from "@/lib/utils"

import { useSettings } from "@/hooks/use-settings"
import { useLocale } from "@/hooks/useLocale"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageDropdown({
  dictionary,
}: {
  dictionary: DictionaryType
}) {
  const pathname = usePathname()
  const locale = useLocale()
  const { settings, updateSettings } = useSettings()

  const direction = i18n.localeDirection[locale]

  const setLocale = useCallback(
    (localeName: LocaleType) => {
      updateSettings({ ...settings, locale: localeName })
    },
    [settings, updateSettings]
  )

  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Language">
          <Earth className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {dictionary.navigation.language.language}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={locale}>
          {i18n.locales.map((locale) => {
            const localeName = i18n.localeNames[locale]
            const localizedLocaleName = getDictionaryValue(
              localeName,
              dictionary.navigation.language
            )

            return (
              <Link
                key={locale}
                href={relocalizePathname(pathname, locale)}
                onClick={() => setLocale(locale)}
              >
                <DropdownMenuRadioItem value={locale}>
                  {localizedLocaleName}
                </DropdownMenuRadioItem>
              </Link>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
