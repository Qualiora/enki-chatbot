"use client"

import { useChat } from "@ai-sdk/react"
import { toast } from "sonner"

import type { UIMessage } from "ai"

import { ChatSDKError } from "@/lib/errors"

import { useApiKey } from "@/hooks/use-api-key"
import { useModel } from "@/hooks/use-model"
import { ApiKeysRequiredAlert } from "@/app/[lang]/(chat)/chat/_components/api-keys-required-alert"
import { ThreadInputForm } from "@/app/[lang]/(chat)/chat/_components/thread-input-form"
import { ThreadMessageList } from "@/app/[lang]/(chat)/chat/_components/thread-messages"

export function Thread({
  threadId,
  initialMessages,
}: {
  threadId?: string
  initialMessages: UIMessage[]
}) {
  const { selectedModel } = useModel()
  const { hasRequiredKeys } = useApiKey()

  const { id, messages, setMessages, status, append, stop, reload } = useChat({
    id: threadId,
    initialMessages,
    body: {
      model: selectedModel,
    },
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast.error(error.message)
      }
    },
  })

  const isSubmitted = status === "submitted"

  return (
    <section className="h-full flex flex-col justify-between items-center">
      <ThreadMessageList
        messages={messages}
        threadId={id}
        isSubmitted={isSubmitted}
        setMessages={setMessages}
        reload={reload}
        stop={stop}
      />
      {hasRequiredKeys ? (
        <ThreadInputForm
          threadId={id}
          append={append}
          status={status}
          onStop={stop}
        />
      ) : (
        <ApiKeysRequiredAlert />
      )}
    </section>
  )
}
