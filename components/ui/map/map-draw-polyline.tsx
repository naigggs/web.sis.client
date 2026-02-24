"use client"

import * as React from "react"
import { useMap } from "react-leaflet"
import type { Draw, DrawOptions, DrawEvents, DrawMap } from "leaflet"
import { IconRoute } from "@tabler/icons-react"

import { useLeaflet } from "@/hooks/use-leaftlet"

import { MapDrawShapeButton } from "./map-draw-shape-button"
import { useMapDrawHandleIcon } from "./map-hooks"
import { useMapDrawContext } from "./map-context"

export function MapDrawPolyline({
  showLength = false,
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
}: DrawOptions.PolylineOptions & { className?: string }) {
  const mapDrawHandleIcon = useMapDrawHandleIcon()
  const drawContext = useMapDrawContext()
  const { L } = useLeaflet()
  const map = useMap()
  const drawToolRef = React.useRef<Draw.Polyline | null>(null)

  React.useEffect(() => {
    if (!L || !map || drawContext?.activeMode !== "polyline") return

    function handleDrawVertex(event: DrawEvents.DrawVertex) {
      const layers = event.layers
      if (!layers || !drawToolRef.current) return

      const markers = layers.getLayers()
      if (markers.length < 2) return

      const firstMarker = markers[0] as L.Marker
      if (!firstMarker) return

      firstMarker.off("click")
      firstMarker.on("click", () => {
        if (drawToolRef.current && markers.length >= 2) {
          drawToolRef.current.addVertex(firstMarker.getLatLng())
          ;(drawToolRef.current as unknown as { completeShape: () => void }).completeShape()
        }
      })
      const element = firstMarker.getElement()
      if (element) {
        element.style.cursor = "pointer"
        element.title = "Click to close polyline"
      }
    }

    map.on(L.Draw.Event.DRAWVERTEX, handleDrawVertex as L.LeafletEventHandlerFn)

    return () => {
      map.off(L.Draw.Event.DRAWVERTEX, handleDrawVertex as L.LeafletEventHandlerFn)
    }
  }, [L, map, drawContext?.activeMode])

  const createDrawTool = React.useCallback(
    (LeafletLib: typeof import("leaflet"), mapInstance: DrawMap) => {
      const tool = new LeafletLib.Draw.Polyline(mapInstance, {
        ...(mapDrawHandleIcon
          ? {
              icon: mapDrawHandleIcon,
              touchIcon: mapDrawHandleIcon,
            }
          : {}),
        showLength,
        drawError,
        shapeOptions,
        ...props,
      })
      drawToolRef.current = tool
      return tool
    },
    [mapDrawHandleIcon, showLength, drawError, shapeOptions, props],
  )

  return (
    <MapDrawShapeButton drawMode="polyline" createDrawTool={createDrawTool} className={className}>
      <IconRoute />
    </MapDrawShapeButton>
  )
}
