"use client"

import { useChat } from "@ai-sdk/react"
import { toast } from "sonner"
import { useSWRConfig } from "swr"
import { unstable_serialize } from "swr/infinite"

import type { UIMessage } from "ai"

import { modelConfigs } from "@/configs/models"
import { ChatSDKError } from "@/lib/errors"
import {
  fetchWithErrorHandlers,
  generateUUID,
  getChatHistoryPaginationKey,
} from "@/lib/utils"

import { useApiKey } from "@/hooks/use-api-key"
import { useAutoResume } from "@/hooks/use-auto-resume"
import { useModel } from "@/hooks/use-model"
import { ApiKeysRequiredAlert } from "@/app/[lang]/(chat)/chat/_components/api-keys-required-alert"
import { ThreadInputForm } from "@/app/[lang]/(chat)/chat/_components/thread-input-form"
import { ThreadMessageList } from "@/app/[lang]/(chat)/chat/_components/thread-messages"

export function Thread({
  threadId,
  initialMessages,
  autoResume,
}: {
  threadId?: string
  initialMessages?: UIMessage[]
  autoResume: boolean
}) {
  const { selectedModel } = useModel()
  const { hasRequiredKeys } = useApiKey()
  const { mutate } = useSWRConfig()
  const { getKey } = useApiKey()
  const { getModelConfig } = useModel()

  const modelConfig = getModelConfig()

  const {
    id,
    messages,
    setMessages,
    status,
    append,
    stop,
    reload,
    experimental_resume,
    data,
  } = useChat({
    id: threadId,
    initialMessages,
    fetch: fetchWithErrorHandlers,
    generateId: generateUUID,
    experimental_throttle: 100,
    experimental_prepareRequestBody: (body) => ({
      id: body.id,
      message: body.messages.at(-1),
      selectedChatModel: selectedModel,
      selectedProvider: modelConfigs[selectedModel].provider,
    }),
    onFinish: () => {
      mutate(unstable_serialize(getChatHistoryPaginationKey))
    },
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast.error(error.message)
      }
    },
    headers: {
      [modelConfig.headerKey]: getKey(modelConfig.provider) || "",
    },
  })

  useAutoResume({
    autoResume,
    initialMessages: initialMessages || [],
    experimental_resume,
    data,
    setMessages,
  })

  return (
    <section className="h-full flex flex-col justify-between items-center">
      <ThreadMessageList
        messages={messages}
        threadId={id}
        status={status}
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
