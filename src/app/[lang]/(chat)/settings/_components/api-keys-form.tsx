"use client"

import { useCallback, useEffect, useState } from "react" // Import useState
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react" // Import Eye and EyeOff icons

import { cn } from "@/lib/utils"

import { useApiKey } from "@/hooks/use-api-key"
import { Button, ButtonLoading, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const ApiKeysSchema = z.object({
  google: z.string().trim().optional(),
  openrouter: z.string().trim().optional(),
  openai: z.string().trim().optional(),
  anthropic: z.string().trim().optional(),
})

type ApiKeysFormType = z.infer<typeof ApiKeysSchema>

export function ApiKeysForm() {
  const { keys, updateKeys } = useApiKey()
  const [showGoogleKey, setShowGoogleKey] = useState(false)
  const [showOpenrouterKey, setShowOpenrouterKey] = useState(false)
  const [showOpenaiKey, setShowOpenaiKey] = useState(false)
  const [showAnthropicKey, setShowAnthropicKey] = useState(false)

  const form = useForm<ApiKeysFormType>({
    resolver: zodResolver(ApiKeysSchema),
    defaultValues: keys,
  })

  const { isValid, isSubmitting } = form.formState
  const isDisabled = !isValid || isSubmitting // Disable button if form is invalid or submitting

  useEffect(() => {
    form.reset(keys)
  }, [keys, form.reset, form])

  const handleSubmit = useCallback(
    (data: ApiKeysFormType) => {
      updateKeys(data)
      toast.success("API keys saved successfully")
    },
    [updateKeys]
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-3">
        <FormField
          control={form.control}
          name="google"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showGoogleKey ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowGoogleKey((prev) => !prev)}
                >
                  {showGoogleKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showGoogleKey
                      ? "Hide Google API key"
                      : "Show Google API key"}
                  </span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="openrouter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenRouter</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showOpenrouterKey ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowOpenrouterKey((prev) => !prev)}
                >
                  {showOpenrouterKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showOpenrouterKey
                      ? "Hide OpenRouter API key"
                      : "Show OpenRouter API key"}
                  </span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="openai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenAI</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showOpenaiKey ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowOpenaiKey((prev) => !prev)}
                >
                  {showOpenaiKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showOpenaiKey
                      ? "Hide OpenAI API key"
                      : "Show OpenAI API key"}
                  </span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="anthropic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anthropic</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showAnthropicKey ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowAnthropicKey((prev) => !prev)}
                >
                  {showAnthropicKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showAnthropicKey
                      ? "Hide Anthropic API key"
                      : "Show Anthropic API key"}
                  </span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-end mt-3">
          <p className="text-sm text-muted-foreground">
            By adding new API key, you agree to our{" "}
            <Link
              href="#"
              className={cn(buttonVariants({ variant: "link" }), "inline p-0")}
            >
              API key Terms
            </Link>
            .
          </p>
          <ButtonLoading
            isLoading={isSubmitting}
            disabled={isDisabled}
            className="ms-auto mt-3"
          >
            Save
          </ButtonLoading>
        </div>
      </form>
    </Form>
  )
}
