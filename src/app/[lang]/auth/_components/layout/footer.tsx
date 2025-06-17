import Link from "next/link"

import type { DictionaryType } from "@/lib/get-dictionary"

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"

export function Footer({ dictionary }: { dictionary: DictionaryType }) {
  return (
    <footer className="sticky bottom-0 z-50 h-14 w-full flex justify-center items-center px-4 bg-background border-t border-border">
      <p className="text-center text-sm text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link
          href="terms-and-policies#terms"
          className={cn(buttonVariants({ variant: "link" }), "inline p-0")}
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="terms-and-policies#policies"
          className={cn(buttonVariants({ variant: "link" }), "inline p-0")}
        >
          Privacy Policy
        </Link>
      </p>
    </footer>
  )
}
