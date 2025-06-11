"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { signOut } from "next-auth/react"
import { CircleHelp, FileCheck2, LogOut, UserCog } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { userData } from "@/data/user"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserDropdown({ dictionary }: { dictionary: DictionaryType }) {
  const params = useParams()

  const locale = params.lang as LocaleType

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-lg"
          aria-label="User"
        >
          <Avatar className="size-9">
            <AvatarImage src={userData?.avatar} alt="" />
            <AvatarFallback className="bg-transparent">
              {userData?.name && getInitials(userData.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <DropdownMenuLabel className="flex gap-2">
          <Avatar>
            <AvatarImage src={userData?.avatar} alt="Avatar" />
            <AvatarFallback className="bg-transparent">
              {userData?.name && getInitials(userData.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground font-semibold truncate">
              {userData?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={ensureLocalizedPathname("/pages/account/settings", locale)}
            >
              <UserCog className="me-2 size-4" />
              {dictionary.navigation.userNav.settings}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={ensureLocalizedPathname("/help-center", locale)}>
              <CircleHelp className="me-2 size-4" />
              {dictionary.navigation.userNav.HelpAndFaq}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ensureLocalizedPathname("/terms-and-policies", locale)}>
              <FileCheck2 className="me-2 size-4" />
              {dictionary.navigation.userNav.TermsAndPolicies}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="me-2 size-4" />
            {dictionary.navigation.userNav.signOut}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
