"use client"

import type { ReactNode } from "react"

import { Header } from "./header"
import { Sidebar } from "./sidebar"

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="w-full">
        <Header />
        <main className="min-h-[calc(100svh-4rem)] bg-muted/50">
          {children}
        </main>
      </div>
    </>
  )
}
