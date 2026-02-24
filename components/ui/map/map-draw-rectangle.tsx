"use client"

import type { DrawOptions } from "leaflet"
import { IconSquare } from "@tabler/icons-react"

import { MapDrawShapeButton } from "./map-draw-shape-button"

export function MapDrawRectangle({
  showArea = false,
  shapeOptions = {
    color: "var(--color-primary)",
    opacity: 1,
    weight: 2,
  },
  className,
  ...props
}: DrawOptions.RectangleOptions & { className?: string }) {
  return (
    <MapDrawShapeButton
      drawMode="rectangle"
      createDrawTool={(L, map) =>
        new L.Draw.Rectangle(map, {
          showArea,
          shapeOptions,
          ...props,
        })
      }
      className={className}
    >
      <IconSquare />
    </MapDrawShapeButton>
  )
}
