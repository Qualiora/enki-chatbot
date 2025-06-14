"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Search } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { GroupedChatsType, LocaleType } from "@/types"
import type { DialogProps } from "@radix-ui/react-dialog"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { cn } from "@/lib/utils"

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
import { ScrollArea } from "@/components/ui/scroll-area"

interface CommandMenuProps extends DialogProps {
  dictionary: DictionaryType
  buttonClassName?: string
  chatsGrouped?: GroupedChatsType
}

export function CommandMenu({
  buttonClassName,
  dictionary,
  chatsGrouped,
  ...props
}: CommandMenuProps) {
  const [open, setOpen] = useState(false)
  const params = useParams()
  const router = useRouter()

  const threadId = params.threadId
  const locale = params.lang as LocaleType

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
            {chatsGrouped?.sortedKeys.map((groupLabel) => (
              <CommandGroup
                key={groupLabel}
                heading={groupLabel}
                className="[&_[cmdk-group-items]]:space-y-1"
              >
                {chatsGrouped.grouped[groupLabel].map((chat) => {
                  const localizedPathname = ensureLocalizedPathname(
                    "/chat/" + chat.id,
                    locale
                  )
                  const isActive = threadId === chat.id

                  return (
                    <CommandItem
                      key={chat.id}
                      onSelect={() =>
                        runCommand(() => router.push(localizedPathname))
                      }
                      className={cn(isActive && "bg-accent")}
                    >
                      <span>{chat.title}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
          </ScrollArea>
        </CommandList>
      </CommandDialog>
    </>
  )
}
