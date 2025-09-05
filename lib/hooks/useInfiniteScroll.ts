"use client"

import { useCallback, useRef } from "react"

export function useInfiniteScroll(callback: () => void, isLoading: boolean): [(node: HTMLElement | null) => void] {
  const observer = useRef<IntersectionObserver>()

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          callback()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, callback],
  )

  return [lastElementRef]
}
