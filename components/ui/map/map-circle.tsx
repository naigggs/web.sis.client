"use client"

import type { Ref } from "react"
import type { CircleProps } from "react-leaflet"
import type { Circle } from "leaflet"

import { cn } from "@/lib/utils"
import { LeafletCircle } from "@/components/ui"

export function MapCircle({ className, ...props }: CircleProps & { ref?: Ref<Circle> }) {
  return (
    <LeafletCircle
      className={cn("fill-foreground stroke-foreground stroke-2", className)}
      {...props}
    />
  )
}
