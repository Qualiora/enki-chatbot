import { useCallback } from "react"

import type { ModelType } from "@/types"

import { models } from "@/configs/models"
import { getModelConfig } from "@/lib/models"

import { useApiKey } from "@/hooks/use-api-key"
import { useModel } from "@/hooks/use-model"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ModelDropdown() {
  const { getKey } = useApiKey()
  const { selectedModel, updateModel } = useModel()

  const isModelEnabled = useCallback(
    (model: ModelType) => {
      const modelConfig = getModelConfig(model)
      const apiKey = getKey(modelConfig.provider)
      return !!apiKey
    },
    [getKey]
  )

  function handleSelectModel(model: ModelType) {
    return isModelEnabled(model) && updateModel(model)
  }

  return (
    <Select
      value={selectedModel}
      onValueChange={handleSelectModel}
      defaultValue={selectedModel}
    >
      <SelectTrigger className="max-w-44 me-auto">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => {
          return (
            <SelectItem
              key={model}
              value={model}
              disabled={!isModelEnabled(model)}
            >
              {model}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
