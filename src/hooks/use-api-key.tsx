"use client"

import { useContext } from "react"

import type { ApiKeyContextType } from "@/types"

import { ApiKeyContext } from "@/contexts/api-key-context"

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext)
  if (!context) {
    throw new Error("useApiKey must be used within an ApiKeyProvider")
  }
  return context
}
