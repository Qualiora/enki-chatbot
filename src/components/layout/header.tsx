import { SidebarTrigger } from "@/components//ui/sidebar"
import { FullscreenToggle } from "@/components/layout/full-screen-toggle"
import { ModeDropdown } from "@/components/layout/mode-dropdown"
import { UserDropdown } from "@/components/layout/user-dropdown"

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 w-full flex justify-end items-center gap-2 px-4 bg-background border-b border-sidebar-border">
      <SidebarTrigger className="me-auto" />
      <FullscreenToggle />
      <ModeDropdown />
      <UserDropdown />
    </header>
  )
}
