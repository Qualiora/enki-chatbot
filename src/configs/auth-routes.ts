import type { RouteType } from "@/types"

export const routeMap = new Map<string, RouteType>([
  ["/auth", { type: "guest" }],
])
