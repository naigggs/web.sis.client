"use client"

import type { Ref } from "react"
import type { CircleMarkerProps } from "react-leaflet"
import type { CircleMarker } from "leaflet"

import { cn } from "@/lib/utils"
import { LeafletCircleMarker } from "@/components/ui"

export function MapCircleMarker({
  className,
  ...props
}: CircleMarkerProps & { ref?: Ref<CircleMarker> }) {
  return (
    <LeafletCircleMarker
      className={cn("fill-foreground stroke-foreground stroke-2", className)}
      {...props}
    />
  )
}
