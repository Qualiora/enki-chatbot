import type { DictionaryType } from "@/lib/get-dictionary"
import type { GroupedChatsType } from "@/types"
import type { ReactNode } from "react"

import { Customizer } from "@/components/customizer"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"

export function Layout({
  children,
  dictionary,
  chatsGrouped,
}: {
  children: ReactNode
  dictionary: DictionaryType
  chatsGrouped?: GroupedChatsType
}) {
  return (
    <>
      <Customizer />
      <Sidebar dictionary={dictionary} chatsGrouped={chatsGrouped} />
      <div className="w-full">
        <Header dictionary={dictionary} />
        <main className="h-[calc(100svh-3.525rem)] bg-muted/40">
          {children}
        </main>
      </div>
    </>
  )
}
