import type { LocaleType } from "@/types"

import { NotFound404 } from "@/components/not-found-404"

export default async function NotFoundPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params
  const locale = params.lang

  return <NotFound404 locale={locale} />
}
