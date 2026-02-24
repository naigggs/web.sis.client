"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useLeaflet } from "@/hooks/use-leaftlet"

export function MapControlContainer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { L } = useLeaflet()
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!L) return
    const element = containerRef.current
    if (!element) return
    L.DomEvent.disableClickPropagation(element)
    L.DomEvent.disableScrollPropagation(element)
  }, [L])

  return (
    <div
      ref={containerRef}
      className={cn("absolute z-1000 size-fit cursor-default", className)}
      {...props}
    />
  )
}
