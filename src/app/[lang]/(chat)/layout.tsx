import type { LocaleType } from "@/types"
import type { ReactNode } from "react"

import { getDictionary } from "@/lib/get-dictionary"

import { ChatLayout } from "@/app/[lang]/(chat)/_components/layout"

export default async function Layout(props: {
  children: ReactNode
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params

  const { children } = props
  const dictionary = await getDictionary(params.lang)

  return <ChatLayout dictionary={dictionary}>{children}</ChatLayout>
}
