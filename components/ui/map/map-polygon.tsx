"use client"

import type { Ref } from "react"
import type { PolygonProps } from "react-leaflet"
import type { Polygon } from "leaflet"

import { cn } from "@/lib/utils"
import { LeafletPolygon } from "@/components/ui"

export function MapPolygon({ className, ...props }: PolygonProps & { ref?: Ref<Polygon> }) {
  return (
    <LeafletPolygon
      className={cn("fill-foreground stroke-foreground stroke-2", className)}
      {...props}
    />
  )
}
