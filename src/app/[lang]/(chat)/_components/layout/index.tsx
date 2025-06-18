import type { DictionaryType } from "@/lib/get-dictionary"
import type { ReactNode } from "react"

import { Header } from "@/app/[lang]/(chat)/_components/layout/header"
import { Sidebar } from "@/app/[lang]/(chat)/_components/layout/sidebar"
import { Customizer } from "@/components/customizer"

export async function ChatLayout({
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
        <main className="h-[calc(100svh-3.525rem)] bg-muted/40">
          {children}
        </main>
      </div>
    </>
  )
}
