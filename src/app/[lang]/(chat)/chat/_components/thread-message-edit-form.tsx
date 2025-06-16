"use client"

import { useCompletion } from "@ai-sdk/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import type { UseChatHelpers } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import type { Dispatch, SetStateAction } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { ThreadInput } from "@/app/[lang]/(chat)/chat/_components/thread-input"

const ThreadMessageEditSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").trim(),
})

type ThreadMessageEditFormType = z.infer<typeof ThreadMessageEditSchema>

interface ThreadMessageEditFormProps {
  threadId: string
  message: UIMessage
  content: string
  setMessages: UseChatHelpers["setMessages"]
  setIsEditing: Dispatch<SetStateAction<boolean>>
  reload: UseChatHelpers["reload"]
  stop: UseChatHelpers["stop"]
}

export function ThreadMessageEditForm({
  threadId,
  message,
  content,
  setMessages,
  reload,
  setIsEditing,
  stop,
}: ThreadMessageEditFormProps) {
  const { complete } = useCompletion({
    api: "/api/completion",
  })
  const form = useForm<ThreadMessageEditFormType>({
    resolver: zodResolver(ThreadMessageEditSchema),
    defaultValues: {
      message: content,
    },
  })
  const { isValid } = form.formState
  const isDisabled = !isValid // Disable button if form is invalid

  const handleSubmit = (data: ThreadMessageEditFormType) => {
    try {
      const updatedMessage = {
        ...message,
        content: data.message,
        parts: [
          {
            type: "text" as const,
            text: data.message,
          },
        ],
        createdAt: new Date(),
      }

      setMessages((messages) => {
        const index = messages.findIndex((m) => m.id === message.id)

        if (index !== -1) {
          return [...messages.slice(0, index), updatedMessage]
        }

        return messages
      })

      complete(data.message, {
        body: {
          messageId: updatedMessage.id,
          threadId,
        },
      })
      setIsEditing(false)

      stop() // stop the current stream if any
      setTimeout(() => {
        reload()
      }, 0)
      form.reset()
    } catch (error) {
      console.error("Failed to save message:", error)
      toast("Failed to save message")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      form.handleSubmit(handleSubmit)()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid space-y-2"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="sr-only">Edit message input</FormLabel>
              <FormControl>
                <ThreadInput {...field} onKeyDown={handleKeyDown} />
              </FormControl>
              <FormDescription className="sr-only">
                Press Enter to save. Press Shift + Enter to insert a new line.
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="reset"
            variant="secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isDisabled}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
