"use client"

import { createContext, useCallback, useEffect, useMemo, useState } from "react"

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
    return stored ? (JSON.parse(stored) as ApiKeysType) : defaultKeys
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

  const hasRequiredKeys = useMemo(() => {
    return Object.values(keys).some((key) => key !== "")
  }, [keys])

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updatedKeys = JSON.parse(e.newValue) as ApiKeysType
          setKeysState(updatedKeys)
        } catch (error) {
          console.error(
            "Failed to parse updated storage value:",
            error,
            e.newValue
          )
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
