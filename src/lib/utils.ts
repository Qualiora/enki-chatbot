import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import type { CoreAssistantMessage } from "ai"
import type { ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(fullName: string) {
  if (fullName.length === 0) return ""

  // Split the name by spaces
  const names = fullName.split(" ")
  // Extract the first letter of each name and convert it to uppercase
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("")

  return initials
}

export function ensureWithPrefix(value: string, prefix: string) {
  return value.startsWith(prefix) ? value : `${prefix}${value}`
}

export function ensureWithSuffix(value: string, suffix: string) {
  return value.endsWith(suffix) ? value : `${value}${suffix}`
}

export function ensureWithoutSuffix(value: string, suffix: string) {
  return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value
}

export function ensureWithoutPrefix(value: string, prefix: string) {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value
}

export function ensureRedirectPathname(
  basePathname: string,
  redirectPathname: string
) {
  const searchParams = new URLSearchParams({
    redirectTo: ensureWithoutSuffix(redirectPathname, "/"),
  })

  return ensureWithSuffix(basePathname, "?" + searchParams.toString())
}

export function wait(ms: number = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Retrieve the dictionary value safely
export function getDictionaryValue(
  key: string,
  section: Record<string, unknown>
) {
  const value = section[key]

  if (typeof value !== "string") {
    throw new Error(
      `Invalid dictionary value for key: ${key}. Please ensure all values are correctly set in the dictionary files.`
    )
  }

  return value
}

export function getTrailingMessageId({
  messages,
}: {
  messages: Array<CoreAssistantMessage & { id?: string }>
}) {
  const trailingMessage = messages.at(-1)

  if (!trailingMessage) return null

  return trailingMessage.id
}
