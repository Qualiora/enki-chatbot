"use client"

import { useEffect, useRef } from "react"

export function useAutogrowingTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta || ta.nodeName !== "TEXTAREA") return

    let previousHeight: number | null = null
    const computed = window.getComputedStyle(ta)

    const cacheScrollTops = (el: HTMLElement) => {
      const arr: [HTMLElement, number][] = []
      while (el && el.parentElement) {
        if (el.parentElement.scrollTop) {
          arr.push([el.parentElement, el.parentElement.scrollTop])
        }
        el = el.parentElement
      }
      return () => {
        arr.forEach(([node, scrollTop]) => {
          node.style.scrollBehavior = "auto"
          node.scrollTop = scrollTop
          node.style.scrollBehavior = ""
        })
      }
    }

    const setHeight = ({
      restoreTextAlign = null,
      testForHeightReduction = true,
    }: {
      restoreTextAlign?: string | null
      testForHeightReduction?: boolean
    } = {}) => {
      if (ta.scrollHeight === 0) return

      if (computed.resize === "vertical") {
        ta.style.resize = "none"
      } else if (computed.resize === "both") {
        ta.style.resize = "horizontal"
      }

      let restoreScrollTops: (() => void) | undefined
      if (testForHeightReduction) {
        restoreScrollTops = cacheScrollTops(ta)
        ta.style.height = ""
      }

      let newHeight: number
      if (computed.boxSizing === "content-box") {
        newHeight =
          ta.scrollHeight -
          (parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom))
      } else {
        newHeight =
          ta.scrollHeight +
          parseFloat(computed.borderTopWidth) +
          parseFloat(computed.borderBottomWidth)
      }

      if (
        computed.maxHeight !== "none" &&
        newHeight > parseFloat(computed.maxHeight)
      ) {
        if (computed.overflowY === "hidden") {
          ta.style.overflow = "scroll"
        }
        newHeight = parseFloat(computed.maxHeight)
      } else if (computed.overflowY !== "hidden") {
        ta.style.overflow = "hidden"
      }

      ta.style.height = `${newHeight}px`

      if (restoreTextAlign) {
        ta.style.textAlign = restoreTextAlign
      }

      restoreScrollTops?.()

      if (previousHeight !== newHeight) {
        ta.dispatchEvent(new Event("autosize:resized", { bubbles: true }))
        previousHeight = newHeight
      }

      const textAlign = computed.textAlign
      if (computed.overflow === "hidden" && !restoreTextAlign) {
        ta.style.textAlign = textAlign === "start" ? "end" : "start"
        setHeight({ restoreTextAlign: textAlign, testForHeightReduction: true })
      }
    }

    const onInput = () => {
      setHeight()
    }

    ta.style.overflowX = "hidden"
    ta.style.overflowWrap = "break-word"

    setHeight()

    ta.addEventListener("input", onInput)
    window.addEventListener("resize", () => setHeight())

    return () => {
      ta.removeEventListener("input", onInput)
      window.removeEventListener("resize", () => setHeight())
    }
  }, [])

  return { textareaRef }
}
