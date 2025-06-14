"use client"

import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"

import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"

interface CopyToClipboardProps extends ComponentProps<typeof Button> {
  text: string
  buttonLabel?: string
  successMessage?: string
}

export function CopyToClipboard({
  text,
  buttonLabel = "Copy",
  successMessage = "Copied!",
  ...props
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch (err) {
      console.error("Failed to copy: ", err)
      setCopied(false)
    }
  }

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      disabled={copied}
      {...props}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span className="sr-only">{copied ? successMessage : buttonLabel}</span>
    </Button>
  )
}
