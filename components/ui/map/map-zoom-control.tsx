"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { ButtonGroup } from "@/components/ui"

import { MapControlContainer } from "./map-control-container"
import { MapZoomButtons } from "./map-zoom-buttons"

export function MapZoomControl({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <MapControlContainer className={cn("top-1 left-1", className)}>
      <ButtonGroup orientation="vertical" aria-label="Zoom controls" {...props}>
        <MapZoomButtons />
      </ButtonGroup>
    </MapControlContainer>
  )
}
