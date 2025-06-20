"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { DictionaryType } from "@/lib/get-dictionary"

import { settingsNavData } from "@/app/[lang]/(chat)/settings/_data/settings-nav"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { cn } from "@/lib/utils"

import { useLocale } from "@/hooks/useLocale"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function SettingsNavigationMenu({
  dictionary,
}: {
  dictionary: DictionaryType
}) {
  const pathname = usePathname()
  const locale = useLocale()

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {settingsNavData.map((link) => {
          // const title = getDictionaryValue(
          //   titleCaseToCamelCase(nav.title),
          //   dictionary.navigation
          // )
          const localizedPathname = ensureLocalizedPathname(link.href, locale)
          const isActive = localizedPathname === pathname

          return (
            <NavigationMenuItem key={link.title}>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  isActive && "bg-accent"
                )}
                asChild
              >
                <Link href={localizedPathname}>{link.title}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
