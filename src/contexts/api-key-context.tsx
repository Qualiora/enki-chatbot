"use client"

import { createContext, useCallback, useEffect, useState } from "react"

import type { ApiKeyContextType, ApiKeysType, ProviderType } from "@/types"
import type { ReactNode } from "react"

const STORAGE_KEY = "api-keys"

const defaultKeys: ApiKeysType = {
  google: "",
  openrouter: "",
  openai: "",
}

export const ApiKeyContext = createContext<ApiKeyContextType | undefined>(
  undefined
)

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [keys, setKeysState] = useState<ApiKeysType>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    try {
      return stored ? (JSON.parse(stored) as ApiKeysType) : defaultKeys
    } catch {
      return defaultKeys
    }
  })

  const updateKeys = useCallback((newKeys: Partial<ApiKeysType>) => {
    setKeysState((prev) => {
      const updated = { ...prev, ...newKeys }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const getKey = useCallback(
    (provider: ProviderType): string | null => {
      return keys[provider] || null
    },
    [keys]
  )

  const hasRequiredKeys = useCallback(() => {
    return Boolean(keys.google) // Match Zustand logic
  }, [keys])

  // Cross-tab sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updatedKeys = JSON.parse(e.newValue) as ApiKeysType
          setKeysState(updatedKeys)
        } catch {
          // Ignore malformed JSON
        }
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return (
    <ApiKeyContext value={{ keys, updateKeys, getKey, hasRequiredKeys }}>
      {children}
    </ApiKeyContext>
  )
}
