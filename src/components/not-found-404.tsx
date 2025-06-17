import Link from "next/link"

import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"

import { Button } from "@/components/ui/button"

export function NotFound404({ locale }: { locale: LocaleType }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-y-6 text-center text-foreground bg-background p-4">
      <h1 className="inline-grid text-6xl font-black">
        404 <span className="text-3xl font-semibold">Page Not Found</span>
      </h1>
      <p className="max-w-prose text-xl text-muted-foreground">
        We couldn&apos;t find the page you&apos;re looking for. It might have
        been moved or doesn&apos;t exist.
      </p>
      <Button size="lg" asChild>
        <Link
          href={ensureLocalizedPathname(
            process.env.NEXT_PUBLIC_HOMEPAGE_PATH!,
            locale
          )}
        >
          Home Page
        </Link>
      </Button>
    </div>
  )
}
