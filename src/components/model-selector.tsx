"use client"

import { Brain, ChevronDown, Sparkles, Zap } from "lucide-react"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Model {
  id: string
  name: string
  provider: string
  icon: React.ReactNode
}

const models: Model[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    icon: <Brain className="w-4 h-4" />,
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "google",
    icon: <Sparkles className="w-4 h-4" />,
  },
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (provider: string, model: string) => void
}

export function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const currentModel = models.find((m) => m.id === selectedModel) || models[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 min-w-[140px] justify-between"
        >
          <div className="flex items-center gap-2">
            {currentModel.icon}
            <span className="text-sm">{currentModel.name}</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Select Model</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
          OpenAI
        </DropdownMenuLabel>
        {models
          .filter((m) => m.provider === "openai")
          .map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onModelChange(model.provider, model.id)}
              className="gap-2"
            >
              {model.icon}
              <span>{model.name}</span>
            </DropdownMenuItem>
          ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
          Anthropic
        </DropdownMenuLabel>
        {models
          .filter((m) => m.provider === "anthropic")
          .map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onModelChange(model.provider, model.id)}
              className="gap-2"
            >
              {model.icon}
              <span>{model.name}</span>
            </DropdownMenuItem>
          ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
          Google
        </DropdownMenuLabel>
        {models
          .filter((m) => m.provider === "google")
          .map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onModelChange(model.provider, model.id)}
              className="gap-2"
            >
              {model.icon}
              <span>{model.name}</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
