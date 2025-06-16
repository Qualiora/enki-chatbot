"use client"

import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { SiGithub, SiGoogle } from "react-icons/si"

import type { DictionaryType } from "@/lib/get-dictionary"

import { Button } from "@/components/ui/button"

const errorMessages = {
  Signin: "Try signing in with a different account.",
  OAuthSignin: "Error in constructing the authorization URL.",
  OAuthCallback: "Error in handling the response from OAuth provider.",
  OAuthCreateAccount: "Error in creating the account.",
  EmailCreateAccount: "Error in creating the email account.",
  Callback: "Error in the callback handler.",
  OAuthAccountNotLinked:
    "This account is already linked with a different provider. Please use the same one to sign in.",
  EmailSignin: "Email could not be sent.",
  CredentialsSignin: "Sign in failed. Check your credentials.",
  default: "Unable to sign in.",
}

export function OAuthButtons({ dictionary }: { dictionary: DictionaryType }) {
  const searchParams = useSearchParams()
  const errorMessage = searchParams.get("error") as keyof typeof errorMessages

  return (
    <>
      <Button size="lg" onClick={() => signIn("github")}>
        <SiGithub className="me-2 h-4 w-4" />
        Continue with GitHub
      </Button>
      <Button size="lg" onClick={() => signIn("google")}>
        <SiGoogle className="me-2 h-4 w-4" />
        Continue with Google
      </Button>
      {errorMessage && (
        <p className="text-destructive text-sm" aria-live="polite">
          {errorMessages[errorMessage] || errorMessages.default}
        </p>
      )}
    </>
  )
}
