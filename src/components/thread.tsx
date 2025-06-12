"use client"

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

const InputSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").trim(),
})

type InputFormData = z.infer<typeof InputSchema>

interface ThreadInputFormProps {
  onSubmit: (message: string) => void
  isLoading: boolean
  onStop: () => void
}

function ThreadInputForm({
  onSubmit,
  isLoading,
  onStop,
}: ThreadInputFormProps) {
  const form = useForm<InputFormData>({
    resolver: zodResolver(InputSchema),
    defaultValues: {
      message: "",
    },
  })
  const { textareaRef } = useAutogrowingTextarea()

  const { isValid } = form.formState
  const isDisabled = !isValid // Disable button if form is invalid

  const handleSubmit = (data: InputFormData) => {
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
                      Chat Input. Press Enter to send, Shift + Enter for new
                      line.
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
                          autoComplete="off"
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

  const handleInputSubmit = (message: string) => {
    append({
      role: "user",
      content: message,
    })
  }

  const isLoading = status === "streaming"

  return (
    <section className="h-full flex flex-col justify-between items-center">
      <ul
        className="w-full flex flex-col min-h-0"
        aria-roledescription="chat messages"
      >
        <ScrollArea className="flex-1">
          <div className="container max-w-3xl pt-8 pb-12">
            {messages.length === 0 ? (
              <div className="h-[calc(100vh-18rem)] flex flex-col justify-center items-center text-center space-y-1.5">
                <h1 className="text-4xl font-semibold leading-none">
                  What can I help with?
                </h1>
                <p className="text-muted-foreground text-sm max-w-prose">
                  Ask me anything! I&apos;m powered by {selectedModel} and ready
                  to help.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <li
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
                  </li>
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
      </ul>

      <ThreadInputForm
        onSubmit={handleInputSubmit}
        isLoading={isLoading}
        onStop={stop}
      />
    </section>
  )
}
