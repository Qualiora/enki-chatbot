import type { LocaleType } from "@/types"
import type { ReactNode } from "react"

import { getDictionary } from "@/lib/get-dictionary"

import { AuthLayout } from "./_components/layout"

export default async function Layout(props: {
  params: Promise<{ lang: LocaleType }>
  children: ReactNode
}) {
  const params = await props.params
  const children = props.children
  const dictionary = await getDictionary(params.lang)
  const locale = params.lang

  return (
    <AuthLayout dictionary={dictionary} locale={locale}>
      {children}
    </AuthLayout>
  )
}
