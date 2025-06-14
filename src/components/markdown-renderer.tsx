"use client"

import { memo, useMemo } from "react"
import { marked } from "marked"
import ReactMarkdown from "react-markdown"
import ShikiHighlighter from "react-shiki"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import type { ComponentProps } from "react"
import type { Components, ExtraProps } from "react-markdown"

import { cn } from "@/lib/utils"

import { useIsDarkMode } from "@/hooks/use-mode"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CopyToClipboard } from "./copy-to-clipboard"

type CodeBlockProps = ComponentProps<"code"> & ExtraProps

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const isDarkMode = useIsDarkMode()

  const match = /language-(\w+)/.exec(className || "")
  const theme = isDarkMode ? "dark-plus" : "light-plus"

  if (match) {
    const lang = match[1]
    return (
      <>
        <CodeBlockBar lang={lang} codeString={String(children)} />
        <ScrollArea
          orientation="horizontal"
          className="border-b border-x rounded-b-lg"
        >
          <ShikiHighlighter
            language={lang}
            theme={theme}
            className="text-sm [&>pre]:!bg-secondary [&>pre]:p-4 [&>pre]:!rounded-t-none"
            showLanguage={false}
            addDefaultStyles={false}
            tabindex={false}
          >
            {String(children)}
          </ShikiHighlighter>
        </ScrollArea>
      </>
    )
  }

  return (
    <code
      className="mx-0.5 overflow-auto rounded-lg px-2 py-1 bg-secondary text-secondary-foreground"
      {...props}
    >
      {children}
    </code>
  )
}

function CodeBlockBar({
  lang,
  codeString,
}: {
  lang: string
  codeString: string
}) {
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-secondary text-muted-foreground border rounded-t-lg">
      <span className="text-sm capitalize">{lang}</span>
      <CopyToClipboard text={codeString} className="size-auto" />
    </div>
  )
}

const components: Components = {
  code: CodeBlock as Components["code"],
  pre: ({ children }) => <>{children}</>,
}

function MarkdownBlockRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, [remarkMath]]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  )
}

const MemoizedMarkdownBlockRenderer = memo(
  MarkdownBlockRenderer,
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false
    return true
  }
)
MemoizedMarkdownBlockRenderer.displayName = "MemoizedMarkdownBlockRenderer"

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown)
  return tokens.map((token) => token.raw)
}

export const MarkdownRenderer = memo(
  ({
    content,
    id,
    className,
    ...props
  }: { content: string; id: string } & ComponentProps<"div">) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content])

    return (
      <div
        className={cn(
          "max-w-none prose prose-base text-foreground bread-words dark:prose-invert prose-code:before:content-none prose-code:after:content-none",
          className
        )}
        {...props}
      >
        {blocks.map((block, index) => (
          <MemoizedMarkdownBlockRenderer
            key={`${id}-block-${index}`}
            content={block}
          />
        ))}
      </div>
    )
  }
)
MarkdownRenderer.displayName = "MarkdownRenderer"
