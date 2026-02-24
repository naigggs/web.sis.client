"use client"

import type { Ref } from "react"
import type { PolylineProps } from "react-leaflet"
import type { Polyline } from "leaflet"

import { cn } from "@/lib/utils"
import { LeafletPolyline } from "@/components/ui"

export function MapPolyline({ className, ...props }: PolylineProps & { ref?: Ref<Polyline> }) {
  return (
    <LeafletPolyline
      className={cn("fill-foreground stroke-foreground stroke-2", className)}
      {...props}
    />
  )
}
