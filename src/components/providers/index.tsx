import type { DirectionType, LocaleType } from "@/types"
import type { Session } from "next-auth"
import type { ReactNode } from "react"

import { ApiKeyProvider } from "@/contexts/api-key-context"
import { ModelProvider } from "@/contexts/model-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DirectionProvider } from "./direction-provider"
import { ModeProvider } from "./mode-provider"
import { NextAuthProvider } from "./next-auth-provider"
import { ThemeProvider } from "./theme-provider"

export function Providers({
  session,
  locale,
  direction,
  children,
}: Readonly<{
  session: Session | null
  locale: LocaleType
  direction: DirectionType
  children: ReactNode
}>) {
  return (
    <SettingsProvider locale={locale}>
      <ModeProvider>
        <ThemeProvider>
          <DirectionProvider direction={direction}>
            <NextAuthProvider session={session}>
              <ModelProvider>
                <ApiKeyProvider>
                  <SidebarProvider>{children}</SidebarProvider>
                </ApiKeyProvider>
              </ModelProvider>
            </NextAuthProvider>
          </DirectionProvider>
        </ThemeProvider>
      </ModeProvider>
    </SettingsProvider>
  )
}
