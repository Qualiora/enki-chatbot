"use client"

import { useContext } from "react"

import type { ApiKeyContextType } from "@/types"

import { ApiKeyContext } from "@/contexts/api-key-context"

export const useAPIKeys = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext)
  if (!context) {
    throw new Error("useAPIKeys must be used within an APIKeyProvider")
  }
  return context
}
