"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { MapControlContainer } from "./map-control-container"
import { MapLocateButton, type MapLocateButtonProps } from "./map-locate-button"

export function MapLocateControl({ className, ...props }: MapLocateButtonProps) {
  return (
    <MapControlContainer className={cn("right-1 bottom-1", className)}>
      <MapLocateButton {...props} />
    </MapControlContainer>
  )
}
