"use client"

import * as React from "react"
import { renderToString } from "react-dom/server"
import { IconCircle } from "@tabler/icons-react"

import { useLeaflet } from "@/hooks/use-leaftlet"

export function useMapDrawHandleIcon() {
  const { L } = useLeaflet()
  if (!L) return null

  return L.divIcon({
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: renderToString(
      <IconCircle className="fill-primary stroke-primary pointer-events-auto size-4 cursor-pointer transition-transform hover:scale-110" />,
    ),
  })
}

export function useDebounceLoadingState(delay = 200) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [showLoading, setShowLoading] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    if (isLoading) {
      timeoutRef.current = setTimeout(() => {
        setShowLoading(true)
      }, delay)
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setShowLoading(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isLoading, delay])

  return [showLoading, setIsLoading] as const
}
