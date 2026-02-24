"use client"

import { renderToString } from "react-dom/server"
import type { DrawOptions } from "leaflet"
import { IconMapPin } from "@tabler/icons-react"

import { MapDrawShapeButton } from "./map-draw-shape-button"

export function MapDrawMarker({
  className,
  ...props
}: DrawOptions.MarkerOptions & { className?: string }) {
  return (
    <MapDrawShapeButton
      drawMode="marker"
      createDrawTool={(L, map) =>
        new L.Draw.Marker(map, {
          icon: L.divIcon({
            className: "",
            iconAnchor: [12, 12],
            html: renderToString(<IconMapPin className="size-6" />),
          }),
          ...props,
        })
      }
      className={className}
    >
      <IconMapPin />
    </MapDrawShapeButton>
  )
}
