"use client"

import { useSession } from "next-auth/react"

export const useUserInfo = () => {
  const { data: session, status } = useSession()

  const user = session?.user
  const isLoading = status === "loading"

  return {
    user: user,
    isLoading,
  }
}
