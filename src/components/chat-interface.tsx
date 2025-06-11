"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import {
  ArrowUp,
  Camera,
  Code,
  FileText,
  Palette,
  Paperclip,
  Upload,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { ModelSelector } from "@/components/model-selector"

interface ChatInterfaceProps {
  chatId?: string
  onChatCreated?: (chatId: string, title: string) => void
}

export function ChatInterface({ chatId, onChatCreated }: ChatInterfaceProps) {
  const [selectedProvider, setSelectedProvider] = useState("openai")
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: {
        provider: selectedProvider,
        model: selectedModel,
      },
      onFinish: async (message) => {
        if (!chatId && messages.length === 0) {
          // Create new chat
          const title = messages[0]?.content.slice(0, 50) + "..." || "New Chat"
          try {
            const response = await fetch("/api/chats", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title,
                messages: [...messages, message],
              }),
            })
            if (response.ok) {
              const newChat = await response.json()
              onChatCreated?.(newChat.id, newChat.title)
            }
          } catch (error) {
            console.error("Failed to create chat:", error)
          }
        } else if (chatId) {
          // Update existing chat
          try {
            await fetch("/api/chats", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: chatId,
                messages: [...messages, message],
              }),
            })
          } catch (error) {
            console.error("Failed to update chat:", error)
          }
        }
      },
    })

  const handleModelChange = (provider: string, model: string) => {
    setSelectedProvider(provider)
    setSelectedModel(model)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e)
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const quickActions = [
    { icon: Camera, label: "Clone a Screenshot" },
    { icon: Palette, label: "Import from Figma" },
    { icon: Upload, label: "Upload a Project" },
    { icon: FileText, label: "Landing Page" },
    { icon: Code, label: "Sign Up Form" },
  ]

  return (
    <section className="container h-full flex flex-col p-4">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  New: The AI API is now in beta.
                  <span className="text-green-600 hover:text-green-700 cursor-pointer">
                    Learn More →
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900">
                  What can I help you build?
                </h1>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <action.icon className="w-5 h-5" />
                    <span className="text-xs text-center">{action.label}</span>
                  </Button>
                ))}
              </div>

              {/* Starter Templates */}
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Starter Templates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                  >
                    <div className="text-left">
                      <div className="font-medium">Dashboard Template</div>
                      <div className="text-sm text-gray-500">
                        Admin dashboard with charts
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                  >
                    <div className="text-left">
                      <div className="font-medium">E-commerce Store</div>
                      <div className="text-sm text-gray-500">
                        Product catalog and cart
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
            <div className="max-w-3xl mx-auto py-4 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">AI</span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-3",
                      message.role === "user"
                        ? "bg-gray-900 text-white ml-auto"
                        : "bg-gray-100 text-gray-900"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">U</span>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">AI</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="flex items-end gap-2">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={handleModelChange}
                />
              </div>

              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    handleInputChange(e)
                    adjustTextareaHeight()
                  }}
                  placeholder="Ask AI to build..."
                  className="min-h-[60px] max-h-[200px] resize-none pr-12 py-4"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      onSubmit(e)
                    }
                  }}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
