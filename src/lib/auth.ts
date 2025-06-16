import { getServerSession } from "next-auth"

import { authOptions } from "@/configs/next-auth"

export async function getSession() {
  return await getServerSession(authOptions)
}
