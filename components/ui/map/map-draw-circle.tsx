"use client"

import type { DrawOptions } from "leaflet"
import { IconCircle } from "@tabler/icons-react"

import { MapDrawShapeButton } from "./map-draw-shape-button"

export function MapDrawCircle({
  showRadius = false,
  shapeOptions = {
    color: "var(--color-primary)",
    opacity: 1,
    weight: 2,
  },
  className,
  ...props
}: DrawOptions.CircleOptions & { className?: string }) {
  return (
    <MapDrawShapeButton
      drawMode="circle"
      createDrawTool={(L, map) =>
        new L.Draw.Circle(map, {
          showRadius,
          shapeOptions,
          ...props,
        })
      }
      className={className}
    >
      <IconCircle />
    </MapDrawShapeButton>
  )
}
