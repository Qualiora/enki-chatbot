import { Loader } from "lucide-react"

import type { IconType } from "@/types"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export function LoadingSpinner({
  className,
  ...props
}: ComponentProps<IconType>) {
  return (
    <Loader
      className={cn(
        "h-4 w-4 text-primary rounded-lg animate-spin [animation-duration:2s]",
        className
      )}
      {...props}
    />
  )
}
