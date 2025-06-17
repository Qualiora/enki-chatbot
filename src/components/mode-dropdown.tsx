"use client"

import { useCallback } from "react"
import { MoonStar, Sun, SunMoon } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { ModeType } from "@/types"

import { i18n } from "@/configs/i18n"

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

const modeIcons = {
  light: Sun,
  dark: MoonStar,
  system: SunMoon,
}

export function ModeDropdown({ dictionary }: { dictionary: DictionaryType }) {
  const { settings, updateSettings } = useSettings()
  const locale = useLocale()

  const direction = i18n.localeDirection[locale]
  const mode = settings.mode
  const ModeIcon = modeIcons[mode]

  const setMode = useCallback(
    (modeName: ModeType) => {
      updateSettings({ ...settings, mode: modeName })
    },
    [settings, updateSettings]
  )

  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Mode">
          <ModeIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{dictionary.navigation.mode.mode}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={mode}>
          <DropdownMenuRadioItem value="light" onClick={() => setMode("light")}>
            {dictionary.navigation.mode.light}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" onClick={() => setMode("dark")}>
            {dictionary.navigation.mode.dark}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="system"
            onClick={() => setMode("system")}
          >
            {dictionary.navigation.mode.system}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
