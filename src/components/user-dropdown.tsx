"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { signOut } from "next-auth/react"
import { CircleHelp, FileCheck2, LogOut, UserCog } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { getInitials } from "@/lib/utils"

import { useUserInfo } from "@/hooks/useUserInfo"
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
import { Skeleton } from "@/components/ui/skeleton"

export function UserDropdown({ dictionary }: { dictionary: DictionaryType }) {
  const params = useParams()
  const { user, isLoading } = useUserInfo()

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
            {isLoading ? (
              <Skeleton className="size-full rounded-lg" />
            ) : (
              <>
                <AvatarImage src={user?.image ?? undefined} alt="User Avatar" />
                <AvatarFallback className="bg-transparent">
                  {user?.name && getInitials(user?.name)}
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount className="w-56">
        <DropdownMenuLabel className="flex gap-2">
          <Avatar>
            {isLoading ? (
              <Skeleton className="size-full rounded-lg" />
            ) : (
              <>
                <AvatarImage src={user?.image ?? undefined} alt="User Avatar" />
                <AvatarFallback className="bg-transparent">
                  {user?.name && getInitials(user?.name)}
                </AvatarFallback>
              </>
            )}
          </Avatar>
          {isLoading ? (
            <div className="flex flex-col gap-1 overflow-hidden">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          ) : (
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground font-semibold truncate">
                {user?.email}
              </p>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={ensureLocalizedPathname("/settings", locale)}>
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
