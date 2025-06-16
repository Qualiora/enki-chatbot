"use client"

import { memo } from "react"

import { MarkdownRenderer } from "@/app/[lang]/(chat)/chat/_components/markdown-renderer"

export const ThreadMessageTextUser = memo(
  ({ content }: { content: string }) => {
    return (
      <div className="whitespace-pre-wrap text-base leading-[1.75]">
        <p className="sr-only">Your message: </p>
        <p>{content}</p>
      </div>
    )
  },
  (prev, next) => {
    return prev.content === next.content
  }
)
ThreadMessageTextUser.displayName = "ThreadMessageTextUser"

export const ThreadMessageTextAssistant = memo(
  ({ id, content }: { id: string; content: string }) => {
    return (
      <div className="max-w-[calc(100vw-2rem)] w-full">
        <p className="sr-only">Assistant Reply: </p>
        <MarkdownRenderer id={id} content={content} />
      </div>
    )
  },
  (prev, next) => {
    return prev.id === next.id && prev.content === next.content
  }
)
ThreadMessageTextAssistant.displayName = "ThreadMessageTextAssistant"
