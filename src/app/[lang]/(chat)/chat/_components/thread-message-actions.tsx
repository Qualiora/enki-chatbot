"use client"

import { RefreshCcw, SquarePen } from "lucide-react"

import type { UseChatHelpers } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import type { Dispatch, SetStateAction } from "react"

import { useApiKey } from "@/hooks/use-api-key"
import { Button } from "@/components/ui/button"
import { CopyToClipboard } from "@/components/copy-to-clipboard"

interface ThreadMessageActionsAssistentProps {
  message: UIMessage
  setMessages: UseChatHelpers["setMessages"]
  content: string
  reload: UseChatHelpers["reload"]
  stop: UseChatHelpers["stop"]
}

export function ThreadMessageActionsAssistent({
  message,
  setMessages,
  content,
  reload,
  stop,
}: ThreadMessageActionsAssistentProps) {
  const { hasRequiredKeys } = useApiKey()

  const handleRegenerate = async () => {
    stop() // stop the current request

    setMessages((messages) => {
      const index = messages.findIndex((m) => m.id === message.id)

      if (index !== -1) {
        return [...messages.slice(0, index)]
      }

      return messages
    })

    setTimeout(() => {
      reload()
    }, 0)
  }

  return (
    <div className="absolute start-0 flex gap-x-2 mt-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      {hasRequiredKeys && (
        <Button variant="ghost" size="icon" onClick={handleRegenerate}>
          <RefreshCcw className="w-4 h-4" />
          <span className="sr-only">Regenerate</span>
        </Button>
      )}
      <CopyToClipboard text={content} />
    </div>
  )
}

interface ThreadMessageActionsUserProps {
  message: UIMessage
  setMessages: UseChatHelpers["setMessages"]
  content: string
  setIsEditing: Dispatch<SetStateAction<boolean>>
  reload: UseChatHelpers["reload"]
  stop: UseChatHelpers["stop"]
}

export function ThreadMessageActionsUser({
  message,
  setMessages,
  content,
  setIsEditing,
  reload,
  stop,
}: ThreadMessageActionsUserProps) {
  const { hasRequiredKeys } = useApiKey()

  const handleRegenerate = async () => {
    stop() // stop the current request

    setMessages((messages) => {
      const index = messages.findIndex((m) => m.id === message.id)

      if (index !== -1) {
        return [...messages.slice(0, index + 1)]
      }

      return messages
    })

    setTimeout(() => {
      reload()
    }, 0)
  }

  return (
    <div className="absolute end-0 flex gap-x-2 mt-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
      {hasRequiredKeys && (
        <>
          <Button variant="ghost" size="icon" onClick={handleRegenerate}>
            <RefreshCcw className="w-4 h-4" />
            <span className="sr-only">Regenerate</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <SquarePen className="w-4 h-4" />
            <span className="sr-only">Edit</span>
          </Button>
        </>
      )}
      <CopyToClipboard text={content} />
    </div>
  )
}
