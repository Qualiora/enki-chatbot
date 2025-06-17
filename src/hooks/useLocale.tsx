"use client"

import { useParams } from "next/navigation"

import type { LocaleType } from "@/types"

export function useLocale() {
  const params = useParams()

  const locale = params.lang as LocaleType

  return locale
}
