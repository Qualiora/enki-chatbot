import { redirect } from "next/navigation"

import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"

export default async function SettingsPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params
  const locale = params.lang

  redirect(ensureLocalizedPathname("/settings/keys", locale))
}
