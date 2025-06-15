"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { settingsNavData } from "@/app/[lang]/(chat)/settings/_data/settings-nav"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { cn, isActivePathname } from "@/lib/utils"

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
  const params = useParams()

  const locale = params.lang as LocaleType

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {settingsNavData.map((link) => {
          // const title = getDictionaryValue(
          //   titleCaseToCamelCase(nav.title),
          //   dictionary.navigation
          // )
          const localizedPathname = ensureLocalizedPathname(link.href, locale)
          const isActive = isActivePathname(localizedPathname, pathname)

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
