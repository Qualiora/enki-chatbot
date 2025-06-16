import { z } from "zod"

import { models, providers } from "@/configs/models"

const textPartSchema = z.object({
  text: z.string().min(1).max(2000),
  type: z.enum(["text"]),
})

export const postRequestBodySchema = z.object({
  id: z.string().nanoid(),
  message: z.object({
    id: z.string().nanoid(),
    createdAt: z.coerce.date(),
    role: z.enum(["user"]),
    content: z.string().min(1).max(2000),
    parts: z.array(textPartSchema),
    attachments: z
      .array(
        z.object({
          url: z.string().url(),
          name: z.string().min(1).max(2000),
          contentType: z.enum(["image/png", "image/jpg", "image/jpeg"]),
        })
      )
      .optional(),
  }),
  selectedChatModel: z.enum(models),
  selectedProvider: z.enum(providers),
})

export type PostRequestBody = z.infer<typeof postRequestBodySchema>
