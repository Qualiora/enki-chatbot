"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ApiKeysForm } from "@/app/[lang]/(chat)/settings/_components/api-keys-form"

export function ApiKeys() {
  return (
    <Card className="max-w-3xl w-full mx-auto" asChild>
      <section>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage your API keys. Each request made with these keys will consume
            credits from your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeysForm />
        </CardContent>
      </section>
    </Card>
  )
}
