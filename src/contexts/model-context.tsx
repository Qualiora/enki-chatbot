"use client"

import { createContext, useCallback, useEffect, useState } from "react"

import type { ModelContextType, ModelType } from "@/types"

import { getModelConfig as getModelConfigFn } from "@/lib/models"

const DEFAULT_MODEL: ModelType = "Gemini 2.5 Flash"
const STORAGE_KEY = "selected-model"

export const ModelContext = createContext<ModelContextType | undefined>(
  undefined
)

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedModel, setSelectedModel] = useState<ModelType>(
    (localStorage.getItem(STORAGE_KEY) as ModelType) || DEFAULT_MODEL
  )

  const updateModel = useCallback((model: ModelType) => {
    setSelectedModel(model)
    localStorage.setItem(STORAGE_KEY, model)
  }, [])

  const getModelConfig = useCallback(() => {
    return getModelConfigFn(selectedModel)
  }, [selectedModel])

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setSelectedModel(e.newValue as ModelType)
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return (
    <ModelContext value={{ selectedModel, updateModel, getModelConfig }}>
      {children}
    </ModelContext>
  )
}
