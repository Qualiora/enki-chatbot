import type { DictionaryType } from "@/lib/get-dictionary"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { OAuthButtons } from "./oauth-buttons"

export function Auth({ dictionary }: { dictionary: DictionaryType }) {
  return (
    <section className="container h-full w-full flex justify-center items-center">
      <Card className="max-w-[30rem] w-full">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-4xl" asChild>
            <h1>Welcome!</h1>
          </CardTitle>
          <CardDescription>Sign in to continue to your account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <OAuthButtons dictionary={dictionary} />
        </CardContent>
      </Card>
    </section>
  )
}
