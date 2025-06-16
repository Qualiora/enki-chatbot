"use client"

import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

import { useAutogrowingTextarea } from "@/hooks/use-autogrowing-textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

export function ThreadInput({
  className,
  ...props
}: ComponentProps<"textarea">) {
  const { textareaRef } = useAutogrowingTextarea()

  return (
    <ScrollArea className="max-h-56 rounded-md has-focus-visible:ring-1 has-focus-visible:ring-ring">
      <Textarea
        placeholder="Type your message here..."
        className={cn("text-base focus-visible:ring-0", className)}
        spellCheck="false"
        autoComplete="off"
        autoFocus
        {...props}
        ref={textareaRef}
      />
    </ScrollArea>
  )
}
