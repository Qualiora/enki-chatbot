"use client"

import { Fragment, useState } from "react"

import type { UseChatHelpers } from "@ai-sdk/react"
import type { UIMessage } from "ai"

import { cn } from "@/lib/utils"

import { useModel } from "@/hooks/use-model"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ThreadMessageActionsAssistent,
  ThreadMessageActionsUser,
} from "@/components/thread-message-actions"
import { ThreadMessageEditForm } from "@/components/thread-message-edit-form"
import { ThreadMessageReasoning } from "@/components/thread-message-reasoning"
import {
  ThreadMessageTextAssistant,
  ThreadMessageTextUser,
} from "@/components/thread-message-text"

function ThreadMessageItemUser({
  message,
  threadId,
  setMessages,
  reload,
  stop,
}: {
  message: UIMessage
  threadId: string
  setMessages: UseChatHelpers["setMessages"]
  reload: UseChatHelpers["reload"]
  stop: UseChatHelpers["stop"]
}) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card asChild>
      <li
        className={cn(
          "group relative justify-self-end max-w-[80%] bg-secondary text-secondary-foreground",
          isEditing && "max-w-none w-full"
        )}
      >
        <CardContent className="p-3">
          {message.parts.map((part, index) => {
            const key = `message-${message.id}-part-${index}`

            if (part.type === "text") {
              if (isEditing) {
                return (
                  <ThreadMessageEditForm
                    key={key}
                    threadId={threadId}
                    message={message}
                    content={part.text}
                    setMessages={setMessages}
                    reload={reload}
                    setIsEditing={setIsEditing}
                    stop={stop}
                  />
                )
              }

              return (
                <Fragment key={key}>
                  <ThreadMessageTextUser content={part.text} />
                  <ThreadMessageActionsUser
                    content={part.text}
                    message={message}
                    setIsEditing={setIsEditing}
                    setMessages={setMessages}
                    reload={reload}
                    stop={stop}
                  />
                </Fragment>
              )
            }
          })}
        </CardContent>
      </li>
    </Card>
  )
}

function ThreadMessageItemAssistant({
  message,
  setMessages,
  reload,
  stop,
}: {
  message: UIMessage
  threadId: string
  setMessages: UseChatHelpers["setMessages"]
  reload: UseChatHelpers["reload"]
  stop: UseChatHelpers["stop"]
}) {
  return (
    <Card asChild>
      <li className="group relative justify-self-start bg-transparent border-0">
        <CardContent className="p-0">
          {message.parts.map((part, index) => {
            const key = `message-${message.id}-part-${index}`

            if (part.type == "reasoning") {
              return (
                <ThreadMessageReasoning
                  key={key}
                  reasoning={part.reasoning}
                  id={message.id}
                />
              )
            } else if (part.type === "text") {
              return (
                <Fragment key={key}>
                  <ThreadMessageTextAssistant id={key} content={part.text} />
                  <ThreadMessageActionsAssistent
                    content={part.text}
                    message={message}
                    setMessages={setMessages}
                    reload={reload}
                    stop={stop}
                  />
                </Fragment>
              )
            }
          })}
        </CardContent>
      </li>
    </Card>
  )
}

function ThreadMessagePlaceholder() {
  const { selectedModel } = useModel()

  return (
    <div className="h-[calc(100vh-21rem)] flex flex-col justify-center items-center text-center space-y-1.5">
      <h1 className="text-4xl font-semibold leading-none">
        What can I help with?
      </h1>
      <p className="text-muted-foreground text-sm max-w-prose">
        Ask me anything! I&apos;m powered by {selectedModel} and ready to help.
      </p>
    </div>
  )
}

export function ThreadMessageList({
  messages,
  threadId,
  isSubmitted,
  setMessages,
  reload,
  stop,
}: {
  messages: UIMessage[]
  threadId: string
  isSubmitted: boolean
  setMessages: UseChatHelpers["setMessages"]
  reload: UseChatHelpers["reload"]
  stop: UseChatHelpers["stop"]
}) {
  const isEmpty = messages.length === 0

  return (
    <ul
      className="w-full flex flex-col min-h-0"
      aria-roledescription="chat messages"
    >
      <ScrollArea className="flex-1">
        <div className="container max-w-3xl pt-12 pb-16.5">
          {isEmpty ? (
            <ThreadMessagePlaceholder />
          ) : (
            <div className="grid gap-y-13">
              {messages.map((message) => {
                const isUser = message.role === "user"

                return isUser ? (
                  <ThreadMessageItemUser
                    key={message.id}
                    message={message}
                    threadId={threadId}
                    setMessages={setMessages}
                    reload={reload}
                    stop={stop}
                  />
                ) : (
                  <ThreadMessageItemAssistant
                    key={message.id}
                    message={message}
                    threadId={threadId}
                    setMessages={setMessages}
                    reload={reload}
                    stop={stop}
                  />
                )
              })}

              {isSubmitted && <LoadingSpinner />}
            </div>
          )}
        </div>
      </ScrollArea>
    </ul>
  )
}
