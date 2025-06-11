import type { i18n } from "@/configs/i18n"
import type { LucideIcon, icons } from "lucide-react"
import type { ComponentType, SVGAttributes } from "react"
import type { z } from "zod"
import type { models, providers } from "./configs/models"
import type { radii, themes } from "./configs/themes"
import type { SignInSchema } from "./schemas/sign-in-schema"

export type LayoutType = "vertical" | "horizontal"

export type ModeType = "light" | "dark" | "system"

export type OrientationType = "vertical" | "horizontal"

export type DirectionType = "ltr" | "rtl"

export type LocaleType = (typeof i18n)["locales"][number]

export type ThemeType = keyof typeof themes

export type RadiusType = (typeof radii)[number]

export type SettingsType = {
  theme: ThemeType
  mode: ModeType
  radius: RadiusType
  layout: LayoutType
  locale: LocaleType
}

export interface IconProps extends SVGAttributes<SVGElement> {
  children?: never
  color?: string
}

export type IconType = ComponentType<IconProps> | LucideIcon

export type DynamicIconNameType = keyof typeof icons

export interface UserType {
  id: string
  firstName: string
  lastName: string
  name: string
  password: string
  username: string
  role: string
  avatar: string
  background: string
  status: string
  phoneNumber: string
  email: string
  state: string
  country: string
  address: string
  zipCode: string
  language: string
  timeZone: string
  currency: string
  organization: string
  twoFactorAuth: boolean
  loginAlerts: boolean
  accountReoveryOption?: "email" | "sms" | "codes"
  connections: number
  followers: number
}

export interface RouteType {
  type: "guest" | "public"
  exceptions?: string[]
}

export interface OAuthLinkType {
  href: string
  label: string
  icon: IconType
}

export type SignInFormType = z.infer<typeof SignInSchema>

export interface ChatType {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface GroupedChatsType {
  sortedKeys: string[]
  grouped: Record<string, ChatType[]>
}

export type ModelType = (typeof models)[number]

export type ProviderType = (typeof providers)[number]

export interface ModelConfigType {
  modelId: string
  provider: ProviderType
  headerKey: string
}

export interface ModelContextType {
  selectedModel: ModelType
  updateModel: (model: ModelType) => void
  getModelConfig: () => ModelConfigType
}

export type ApiKeysType = Record<ProviderType, string>

export interface ApiKeyContextType {
  keys: ApiKeysType
  updateKeys: (newKeys: Partial<ApiKeysType>) => void
  hasRequiredKeys: () => boolean
  getKey: (provider: ProviderType) => string | null
}
