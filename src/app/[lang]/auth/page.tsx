import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { getDictionary } from "@/lib/get-dictionary"

import { SignIn } from "@/app/[lang]/auth/_components/sign-in"

export const metadata: Metadata = {
  title: "Auth",
}

export default async function SignInPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params
  const dictionary = await getDictionary(params.lang)

  return <SignIn dictionary={dictionary} />
}
