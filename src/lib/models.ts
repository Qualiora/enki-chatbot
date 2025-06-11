import type { ModelConfigType, ModelType } from "@/types"

import { modelConfigs } from "@/configs/models"

export const getModelConfig = (modelName: ModelType): ModelConfigType => {
  return modelConfigs[modelName]
}
