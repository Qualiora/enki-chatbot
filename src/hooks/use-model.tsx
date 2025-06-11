"use client"

import { useContext } from "react"

import type { ModelContextType } from "@/types"

import { ModelContext } from "@/contexts/model-context"

export function useModel(): ModelContextType {
  const context = useContext(ModelContext)
  if (!context) {
    throw new Error("useModel must be used within a ModelProvider")
  }
  return context
}
