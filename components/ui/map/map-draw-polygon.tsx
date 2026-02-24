"use client"

import * as React from "react"
import { useMap } from "react-leaflet"
import type { Draw, DrawOptions, DrawEvents, DrawMap } from "leaflet"
import { IconPolygon } from "@tabler/icons-react"

import { useLeaflet } from "@/hooks/use-leaftlet"

import { MapDrawShapeButton } from "./map-draw-shape-button"
import { useMapDrawHandleIcon } from "./map-hooks"
import { useMapDrawContext } from "./map-context"

export function MapDrawPolygon({
  drawError = {
    color: "var(--color-destructive)",
  },
  shapeOptions = {
    color: "var(--color-primary)",
    opacity: 1,
    weight: 2,
  },
  className,
  ...props
}: DrawOptions.PolygonOptions & { className?: string }) {
  const mapDrawHandleIcon = useMapDrawHandleIcon()
  const drawContext = useMapDrawContext()
  const { L } = useLeaflet()
  const map = useMap()
  const drawToolRef = React.useRef<Draw.Polygon | null>(null)

  React.useEffect(() => {
    if (!L || !map || drawContext?.activeMode !== "polygon") return

    function handleDrawVertex(event: DrawEvents.DrawVertex) {
      const layers = event.layers
      if (!layers || !drawToolRef.current) return

      const markers = layers.getLayers()
      if (markers.length < 3) return

      const firstMarker = markers[0] as L.Marker
      if (!firstMarker) return

      firstMarker.off("click")
      firstMarker.on("click", () => {
        if (drawToolRef.current && markers.length >= 3) {
          ;(drawToolRef.current as unknown as { completeShape: () => void }).completeShape()
        }
      })
      const element = firstMarker.getElement()
      if (element) {
        element.style.cursor = "pointer"
        element.title = "Click to close polygon"
      }
    }

    map.on(L.Draw.Event.DRAWVERTEX, handleDrawVertex as L.LeafletEventHandlerFn)

    return () => {
      map.off(L.Draw.Event.DRAWVERTEX, handleDrawVertex as L.LeafletEventHandlerFn)
    }
  }, [L, map, drawContext?.activeMode])

  const createDrawTool = React.useCallback(
    (LeafletLib: typeof import("leaflet"), mapInstance: DrawMap) => {
      const tool = new LeafletLib.Draw.Polygon(mapInstance, {
        ...(mapDrawHandleIcon
          ? {
              icon: mapDrawHandleIcon,
              touchIcon: mapDrawHandleIcon,
            }
          : {}),
        drawError,
        shapeOptions,
        allowIntersection: false,
        ...props,
      })
      drawToolRef.current = tool
      return tool
    },
    [mapDrawHandleIcon, drawError, shapeOptions, props],
  )

  return (
    <MapDrawShapeButton drawMode="polygon" createDrawTool={createDrawTool} className={className}>
      <IconPolygon />
    </MapDrawShapeButton>
  )
}
