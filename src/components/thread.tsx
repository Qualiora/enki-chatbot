"use client"

import { useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Bot, Paperclip, Send, Square, User } from "lucide-react"

import type { UIMessage } from "ai"

import { useAutogrowingTextarea } from "@/hooks/use-autogrowing-textarea"
import { useModel } from "@/hooks/use-model"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { ModelDropdown } from "@/components/model-dropdown"

const promptSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").trim(),
})

type PromptFormData = z.infer<typeof promptSchema>

interface ThreadPromptFormProps {
  onSubmit: (message: string) => void
  isLoading: boolean
  onStop: () => void
}

function ThreadPromptForm({
  onSubmit,
  isLoading,
  onStop,
}: ThreadPromptFormProps) {
  const form = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      message: "",
    },
  })
  const { textareaRef } = useAutogrowingTextarea()

  const { isValid } = form.formState
  const isDisabled = !isValid // Disable button if form is invalid

  const handleSubmit = (data: PromptFormData) => {
    if (isLoading) return
    onSubmit(data.message)
    form.reset()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      form.handleSubmit(handleSubmit)()
    }
  }

  return (
    <Form {...form}>
      <div className="container max-w-3xl p-0 z-10">
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
                    <FormLabel className="sr-only">
                      Press Enter to send, Shift + Enter for new
                    </FormLabel>
                    <FormControl>
                      <ScrollArea className="max-h-56 rounded-md has-focus-visible:ring-1 has-focus-visible:ring-ring">
                        <Textarea
                          {...field}
                          ref={textareaRef}
                          placeholder="Type your message here..."
                          className="focus-visible:ring-0"
                          disabled={isLoading}
                          onKeyDown={handleKeyDown}
                          spellCheck="false"
                          autoComplete="false"
                        />
                      </ScrollArea>
                    </FormControl>
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
                onClick={() => isLoading && onStop()}
                aria-live="assertive"
              >
                {isLoading ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {isLoading ? "Loading" : "Send"}
                </span>
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

export function Thread({
  threadId,
  initialMessages,
}: {
  threadId: string
  initialMessages: UIMessage[]
}) {
  const { selectedModel } = useModel()
  const { messages, status, append, stop } = useChat({
    id: threadId,
    initialMessages,
    body: {
      model: selectedModel,
    },
    onError: (error) => {
      toast(error.message)
    },
  })

  const handlePromptSubmit = (message: string) => {
    append({
      role: "user",
      content: message,
    })
  }

  const isLoading = status === "streaming"

  return (
    <section className="flex flex-col justify-between items-center h-full">
      {/* Messages Area */}
      <div className="w-full flex flex-col min-h-0">
        <ScrollArea className="flex-1">
          <div className="container max-w-3xl pt-8 pb-12">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Start a conversation
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Ask me anything! I&apos;m powered by {selectedModel} and
                    ready to help.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <Card
                      className={`max-w-[80%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                      </CardContent>
                    </Card>

                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-secondary">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <Card className="bg-muted">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Thinking...
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <ThreadPromptForm
        onSubmit={handlePromptSubmit}
        isLoading={isLoading}
        onStop={stop}
      />
    </section>
  )
}
