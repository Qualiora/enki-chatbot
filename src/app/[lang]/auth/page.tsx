import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { getDictionary } from "@/lib/get-dictionary"

import { Auth } from "@/app/[lang]/auth/_components/auth"

export const metadata: Metadata = {
  title: "Auth",
}

export default async function AuthPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params
  const dictionary = await getDictionary(params.lang)

  return <Auth dictionary={dictionary} />
}
