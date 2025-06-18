import { redirect } from "next/navigation"

import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"

export default async function ChatPage(props: {
  params: Promise<{ lang: string }>
}) {
  const params = await props.params
  const locale = params.lang as LocaleType

  redirect(ensureLocalizedPathname(process.env.HOMEPAGE_PATH!, locale))
}
