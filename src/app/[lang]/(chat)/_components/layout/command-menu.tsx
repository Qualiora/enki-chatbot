"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import useSWRInfinite from "swr/infinite"
import { Search } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { ChatHistoryType, LocaleType } from "@/types"
import type { DialogProps } from "@radix-ui/react-dialog"

import { ensureLocalizedPathname } from "@/lib/i18n"
import {
  cn,
  fetcher,
  getChatHistoryPaginationKey,
  groupChatsByDate,
} from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { DialogTitle } from "@/components/ui/dialog"
import { Keyboard } from "@/components/ui/keyboard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CommandMenuProps extends DialogProps {
  dictionary: DictionaryType
  buttonClassName?: string
}

export function CommandMenu({
  buttonClassName,
  dictionary,
  ...props
}: CommandMenuProps) {
  const [open, setOpen] = useState(false)
  const params = useParams()
  const router = useRouter()
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const {
    data: paginatedChatHistories,
    setSize,
    isValidating,
  } = useSWRInfinite<ChatHistoryType>(getChatHistoryPaginationKey, fetcher, {
    fallbackData: [],
  })

  const threadId = params.threadId
  const locale = params.lang as LocaleType
  const hasReachedEnd = paginatedChatHistories
    ? paginatedChatHistories.some((page) => page.hasMore === false)
    : false

  useEffect(() => {
    if (hasReachedEnd || isValidating) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSize((size) => size + 1)
        }
      },
      {
        rootMargin: "100px",
      }
    )

    const current = loadMoreRef.current
    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [hasReachedEnd, isValidating, setSize])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className={cn(
          "w-full justify-start px-3 rounded-md bg-muted/50 text-muted-foreground",
          buttonClassName
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <Search className="me-2 h-4 w-4" />
        <span>{dictionary.search.search}</span>
        <Keyboard className="ms-auto">K</Keyboard>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} {...props}>
        <DialogTitle className="sr-only">Search Menu</DialogTitle>
        <CommandInput placeholder={dictionary.search.typeCommand} />
        <CommandList>
          <CommandEmpty>{dictionary.search.noResults}</CommandEmpty>
          <ScrollArea className="h-[300px] max-h-[300px]">
            {paginatedChatHistories &&
              (() => {
                const chatsFromHistory = paginatedChatHistories.flatMap(
                  (paginatedChatHistory) => paginatedChatHistory.chats
                )

                const groupedChats = groupChatsByDate(chatsFromHistory)

                return (
                  <>
                    {groupedChats.today.length > 0 && (
                      <CommandGroup
                        key="Today"
                        heading="Today"
                        className="[&_[cmdk-group-items]]:space-y-1"
                      >
                        {groupedChats.today.map((chat) => (
                          <CommandItem
                            key={chat.id}
                            value={chat.id}
                            onSelect={() =>
                              runCommand(() =>
                                router.push(
                                  ensureLocalizedPathname(
                                    "/chat/" + chat.id,
                                    locale
                                  )
                                )
                              )
                            }
                            className={cn(chat.id === threadId && "bg-accent")}
                          >
                            <span>{chat.title}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {groupedChats.yesterday.length > 0 && (
                      <CommandGroup
                        key="Yesterday"
                        heading="Yesterday"
                        className="[&_[cmdk-group-items]]:space-y-1"
                      >
                        {groupedChats.yesterday.map((chat) => (
                          <CommandItem
                            key={chat.id}
                            value={chat.id}
                            onSelect={() =>
                              runCommand(() =>
                                router.push(
                                  ensureLocalizedPathname(
                                    "/chat/" + chat.id,
                                    locale
                                  )
                                )
                              )
                            }
                            className={cn(chat.id === threadId && "bg-accent")}
                          >
                            <span>{chat.title}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {groupedChats.lastWeek.length > 0 && (
                      <CommandGroup
                        key="Last 7 days"
                        heading="Last 7 days"
                        className="[&_[cmdk-group-items]]:space-y-1"
                      >
                        {groupedChats.lastWeek.map((chat) => (
                          <CommandItem
                            key={chat.id}
                            value={chat.id}
                            onSelect={() =>
                              runCommand(() =>
                                router.push(
                                  ensureLocalizedPathname(
                                    "/chat/" + chat.id,
                                    locale
                                  )
                                )
                              )
                            }
                            className={cn(chat.id === threadId && "bg-accent")}
                          >
                            <span>{chat.title}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {groupedChats.lastMonth.length > 0 && (
                      <CommandGroup
                        key="Last 30 days"
                        heading="Last 30 days"
                        className="[&_[cmdk-group-items]]:space-y-1"
                      >
                        {groupedChats.lastMonth.map((chat) => (
                          <CommandItem
                            key={chat.id}
                            value={chat.id}
                            onSelect={() =>
                              runCommand(() =>
                                router.push(
                                  ensureLocalizedPathname(
                                    "/chat/" + chat.id,
                                    locale
                                  )
                                )
                              )
                            }
                            className={cn(chat.id === threadId && "bg-accent")}
                          >
                            <span>{chat.title}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {groupedChats.older.length > 0 && (
                      <CommandGroup
                        key="Older than last month"
                        heading="Older than last month"
                        className="[&_[cmdk-group-items]]:space-y-1"
                      >
                        {groupedChats.older.map((chat) => (
                          <CommandItem
                            key={chat.id}
                            value={chat.id}
                            onSelect={() =>
                              runCommand(() =>
                                router.push(
                                  ensureLocalizedPathname(
                                    "/chat/" + chat.id,
                                    locale
                                  )
                                )
                              )
                            }
                            className={cn(chat.id === threadId && "bg-accent")}
                          >
                            <span>{chat.title}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </>
                )
              })()}
            <div ref={loadMoreRef} />
            {!hasReachedEnd && (
              <div className="flex flex-row gap-2 items-center text-muted-foreground text-sm px-2 mt-3">
                <LoadingSpinner className="text-muted-foreground" />
                <div>Loading Chats...</div>
              </div>
            )}
          </ScrollArea>
        </CommandList>
      </CommandDialog>
    </>
  )
}
