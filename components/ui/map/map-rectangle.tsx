"use client"

import type { Ref } from "react"
import type { RectangleProps } from "react-leaflet"
import type { Rectangle } from "leaflet"

import { cn } from "@/lib/utils"
import { LeafletRectangle } from "@/components/ui"

export function MapRectangle({ className, ...props }: RectangleProps & { ref?: Ref<Rectangle> }) {
  return (
    <LeafletRectangle
      className={cn("fill-foreground stroke-foreground stroke-2", className)}
      {...props}
    />
  )
}
