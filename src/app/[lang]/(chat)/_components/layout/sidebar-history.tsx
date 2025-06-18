"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import useSWRInfinite from "swr/infinite"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { ChatHistoryType, LocaleType } from "@/types"

import {
  fetcher,
  getChatHistoryPaginationKey,
  groupChatsByDate,
} from "@/lib/utils"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { ThreadItem } from "./sidebar-history-item"

export function SidebarHistory({ dictionary }: { dictionary: DictionaryType }) {
  const { setOpenMobile } = useSidebar()
  const { lang, threadId: id } = useParams()
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const {
    data: paginatedChatHistories,
    setSize,
    isValidating,
    isLoading,
    mutate,
  } = useSWRInfinite<ChatHistoryType>(getChatHistoryPaginationKey, fetcher, {
    fallbackData: [],
  })

  const locale = lang as LocaleType
  const hasReachedEnd = paginatedChatHistories
    ? paginatedChatHistories.some((page) => page.hasMore === false)
    : false

  const hasEmptyChatHistory = paginatedChatHistories
    ? paginatedChatHistories.every((page) => page.chats.length === 0)
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

  const handleDelete = async () => {
    const deletePromise = fetch(`/api/chat?id=${deleteId}`, {
      method: "DELETE",
    })

    toast.promise(deletePromise, {
      loading: "Deleting chat...",
      success: () => {
        mutate((chatHistories) => {
          if (chatHistories) {
            return chatHistories.map((chatHistory) => ({
              ...chatHistory,
              chats: chatHistory.chats.filter((chat) => chat.id !== deleteId),
            }))
          }
        })

        return "Chat deleted successfully"
      },
      error: "Failed to delete chat",
    })

    setShowDeleteDialog(false)

    if (deleteId === id) {
      router.push("/")
    }
  }

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Today</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="flex flex-col gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-8 w-full" />
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  if (hasEmptyChatHistory) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="w-full flex flex-row justify-center items-center gap-2 px-2 text-sm text-muted-foreground">
            Your conversations will appear here once you start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {paginatedChatHistories &&
              (() => {
                const chatsFromHistory = paginatedChatHistories.flatMap(
                  (paginatedChatHistory) => paginatedChatHistory.chats
                )

                const groupedChats = groupChatsByDate(chatsFromHistory)

                return (
                  <>
                    {groupedChats.today.length > 0 && (
                      <>
                        <SidebarGroupLabel>Today</SidebarGroupLabel>
                        {groupedChats.today.map((chat) => (
                          <ThreadItem
                            key={chat.id}
                            thread={chat}
                            locale={locale}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId)
                              setShowDeleteDialog(true)
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.yesterday.length > 0 && (
                      <>
                        <SidebarGroupLabel>Yesterday</SidebarGroupLabel>
                        {groupedChats.yesterday.map((chat) => (
                          <ThreadItem
                            key={chat.id}
                            thread={chat}
                            locale={locale}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId)
                              setShowDeleteDialog(true)
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.lastWeek.length > 0 && (
                      <>
                        <SidebarGroupLabel>Last 7 days</SidebarGroupLabel>
                        {groupedChats.lastWeek.map((chat) => (
                          <ThreadItem
                            key={chat.id}
                            thread={chat}
                            locale={locale}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId)
                              setShowDeleteDialog(true)
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.lastMonth.length > 0 && (
                      <>
                        <SidebarGroupLabel>Last 30 days</SidebarGroupLabel>
                        {groupedChats.lastMonth.map((chat) => (
                          <ThreadItem
                            key={chat.id}
                            thread={chat}
                            locale={locale}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId)
                              setShowDeleteDialog(true)
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.older.length > 0 && (
                      <>
                        <SidebarGroupLabel>
                          Older than last month
                        </SidebarGroupLabel>
                        {groupedChats.older.map((chat) => (
                          <ThreadItem
                            key={chat.id}
                            thread={chat}
                            locale={locale}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId)
                              setShowDeleteDialog(true)
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}
                  </>
                )
              })()}
          </SidebarMenu>
          <div ref={loadMoreRef} />
          {!hasReachedEnd && (
            <div className="flex flex-row gap-2 items-center text-muted-foreground text-sm px-2 mt-3">
              <LoadingSpinner className="text-muted-foreground" />
              <div>Loading Chats...</div>
            </div>
          )}
        </SidebarGroupContent>
      </SidebarGroup>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              chat and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
