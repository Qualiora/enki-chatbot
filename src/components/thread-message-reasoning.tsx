"use client"

import { memo, useState } from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export const ThreadMessageReasoning = memo(
  ({ reasoning, id }: { reasoning: string; id: string }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="max-w-[80%] w-full flex flex-col gap-2 pb-2">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex w-[350px] flex-col gap-2"
        >
          <CollapsibleTrigger
            className="[&[data-state=open]>svg]:rotate-180"
            asChild
          >
            <Button variant="ghost" className="w-fit *:animate-pulse">
              <ChevronDown className="me-2 h-4 w-4 shrink-0 transition-transform duration-200" />
              <span>Reasoning</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden text-sm data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <Card
              className="prose-sm p-4 bg-secondary text-secondary-foreground"
              asChild
            >
              <MarkdownRenderer id={id} content={reasoning} />
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  },
  (prev, next) => {
    return prev.reasoning === next.reasoning && prev.id === next.id
  }
)
ThreadMessageReasoning.displayName = "ThreadMessageReasoning"
