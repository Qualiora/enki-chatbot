import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"
import type { ReactNode } from "react"

import { Footer } from "./footer"
import { Header } from "./header"

export function AuthLayout({
  dictionary,
  locale,
  children,
}: {
  dictionary: DictionaryType
  locale: LocaleType
  children: ReactNode
}) {
  return (
    <div className="w-full">
      <Header dictionary={dictionary} locale={locale} />
      <main className="h-[calc(100svh-7rem)] bg-muted/40">{children}</main>
      <Footer dictionary={dictionary} />
    </div>
  )
}
