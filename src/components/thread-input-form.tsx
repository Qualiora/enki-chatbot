"use client"

import { useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Paperclip, Send, Square } from "lucide-react"

import type { LocaleType } from "@/types"
import type { UseChatHelpers } from "@ai-sdk/react"

import { ensureLocalizedPathname } from "@/lib/i18n"

import { useApiKey } from "@/hooks/use-api-key"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { ModelDropdown } from "@/components/model-dropdown"
import { ThreadInput } from "@/components/thread-input"

const ThreadInputSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").trim(),
})

type ThreadInputFormType = z.infer<typeof ThreadInputSchema>

interface ThreadInputFormProps {
  threadId: string
  append: UseChatHelpers["append"]
  status: UseChatHelpers["status"]
  onStop: () => void
}

export function ThreadInputForm({
  threadId,
  append,
  status,
  onStop,
}: ThreadInputFormProps) {
  const params = useParams()
  const router = useRouter()
  const { hasRequiredKeys } = useApiKey()
  const form = useForm<ThreadInputFormType>({
    resolver: zodResolver(ThreadInputSchema),
    defaultValues: {
      message: "",
    },
  })

  const locale = params.lang as LocaleType
  const { isValid } = form.formState
  const isSubmitted = status === "submitted"
  const isStreaming = status === "streaming"
  const isDisabled = !hasRequiredKeys || !isValid || isSubmitted || isStreaming // Disable button if form is invalid, required API keys are missing, or submission/streaming is in progress

  const handleSubmit = useCallback(
    (data: ThreadInputFormType) => {
      if (isDisabled) return

      if (!params.threadId) {
        router.push(ensureLocalizedPathname(`/chat/${threadId}`, locale))
      }

      append({
        id: threadId,
        role: "user",
        parts: [{ type: "text", text: data.message }],
        content: data.message,
      })
      form.reset()
    },
    [isDisabled, locale, append, params.threadId, threadId, router, form]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      form.handleSubmit(handleSubmit)()
    }
  }

  return (
    <Form {...form}>
      <div className="container max-w-3xl p-0 z-40">
        <Card asChild>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mx-4 -mt-4"
          >
            <CardHeader className="p-3">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">Chat Input.</FormLabel>
                    <FormControl>
                      <ThreadInput
                        {...field}
                        disabled={isStreaming}
                        onKeyDown={handleKeyDown}
                      />
                    </FormControl>
                    <FormDescription className="sr-only">
                      Press Enter to send. Press Shift + Enter to insert a new
                      line.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardHeader>
            <CardContent className="flex justify-end gap-2 p-3 pt-0">
              <ModelDropdown />
              <Button variant="outline" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                type="submit"
                disabled={isDisabled}
                onClick={() => isStreaming && onStop()}
                aria-live="assertive"
              >
                {isStreaming ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">{isStreaming ? "Stop" : "Send"}</span>
              </Button>
            </CardContent>
          </form>
        </Card>
        <p className="text-muted-foreground text-xs text-center p-2">
          AI can make mistakes. Check important info.
        </p>
      </div>
    </Form>
  )
}
