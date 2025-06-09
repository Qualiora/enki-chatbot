"use client"

import { useMedia } from "react-use"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const isMobile = useMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

  return isMobile
}
