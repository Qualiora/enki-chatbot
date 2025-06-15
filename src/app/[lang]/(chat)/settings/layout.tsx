import type { LocaleType } from "@/types"
import type { ReactNode } from "react"

import { getDictionary } from "@/lib/get-dictionary"

import { ScrollArea } from "@/components/ui/scroll-area"
import { SettingsNavigationMenu } from "@/app/[lang]/(chat)/settings/_components/settings-navigation-menu"

export default async function SettingsLayout(props: {
  children: ReactNode
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params

  const { children } = props

  const dictionary = await getDictionary(params.lang)

  return (
    <section className="h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="container w-full flex items-center gap-x-4 px-4 py-2 bg-background border-b">
        <h1 className="text-lg font-medium">Settings</h1>
        <SettingsNavigationMenu dictionary={dictionary} />
      </div>
      <ScrollArea className="flex-1 h-full">
        <div className="container grid gap-6 p-4">{children}</div>
      </ScrollArea>
    </section>
  )
}
