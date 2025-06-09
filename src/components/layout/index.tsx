import type { DictionaryType } from "@/lib/get-dictionary"
import type { ReactNode } from "react"

import { Customizer } from "@/components/customizer"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"

export function Layout({
  children,
  dictionary,
}: {
  children: ReactNode
  dictionary: DictionaryType
}) {
  return (
    <>
      <Customizer />
      <Sidebar dictionary={dictionary} />
      <div className="w-full">
        <Header dictionary={dictionary} />
        <main className="min-h-[calc(100svh-3.525rem)] bg-muted/50">
          {children}
        </main>
      </div>
    </>
  )
}
