"use client"

import Link from "next/link"
import { Key } from "lucide-react"

import { ensureLocalizedPathname } from "@/lib/i18n"

import { useLocale } from "@/hooks/useLocale"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ApiKeysRequiredAlert() {
  const locale = useLocale()

  return (
    <Alert
      role="alert"
      className="fixed bottom-6 z-40 w-fit flex items-center gap-4"
    >
      <Badge className="aspect-square">
        <Key className="size-full" />
      </Badge>
      <div>
        <AlertTitle>API keys required</AlertTitle>
        <AlertDescription>Add keys to enable chat</AlertDescription>
      </div>
      <Button size="sm" variant="outline" asChild>
        <Link href={ensureLocalizedPathname("/settings/keys", locale)}>
          Configure
        </Link>
      </Button>
    </Alert>
  )
}
