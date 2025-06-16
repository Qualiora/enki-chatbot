import Link from "next/link"

import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export function Logo({ className, href = "/", ...props }: ComponentProps<"a">) {
  return (
    <Link
      href={href}
      className={cn("w-fit font-semibold text-xl", className)}
      {...props}
    >
      Enki Chatbot
    </Link>
  )
}
