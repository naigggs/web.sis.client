"use client"

import * as React from "react"
import { useMap } from "react-leaflet"
import type { Draw, DrawOptions, DrawEvents, DrawMap } from "leaflet"
import { IconLine } from "@tabler/icons-react"

import { useLeaflet } from "@/hooks/use-leaftlet"

import { MapDrawShapeButton } from "./map-draw-shape-button"
import { useMapDrawHandleIcon } from "./map-hooks"
import { useMapDrawContext } from "./map-context"

export function MapDrawLine({
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
  tooltipSide,
  ...props
}: DrawOptions.PolylineOptions & {
  className?: string
  tooltipSide?: React.ComponentProps<typeof MapDrawShapeButton>["tooltipSide"]
}) {
  const mapDrawHandleIcon = useMapDrawHandleIcon()
  const drawContext = useMapDrawContext()
  const { L } = useLeaflet()
  const map = useMap()
  const drawToolRef = React.useRef<Draw.Polyline | null>(null)

  React.useEffect(() => {
    if (!L || !map || drawContext?.activeMode !== "line") return

    function handleDrawVertex(event: DrawEvents.DrawVertex) {
      const layers = event.layers
      if (!layers || !drawToolRef.current) return

      const markers = layers.getLayers()
      if (markers.length < 1) return

      const firstMarker = markers[0] as L.Marker
      if (!firstMarker) return

      // For a simple line, we just want to watch for the second point and complete immediately
      const element = firstMarker.getElement()
      if (element) {
        element.style.cursor = "crosshair"
      }
    }

    map.on(L.Draw.Event.DRAWVERTEX, handleDrawVertex as L.LeafletEventHandlerFn)

    return () => {
      map.off(L.Draw.Event.DRAWVERTEX, handleDrawVertex as L.LeafletEventHandlerFn)
    }
  }, [L, map, drawContext?.activeMode])

  const createDrawTool = React.useCallback(
    (LeafletLib: typeof import("leaflet"), mapInstance: DrawMap) => {
      // We use Polyline tool but configured for 2 points max
      // Leaflet.Draw doesn't have a strict "Line" tool, but typical configuration is
      // using Polyline with maxPoints = 2 if available, or just standard Polyline.
      // However, L.Draw.Polyline doesn't natively support maxPoints in standard version.
      // But we can trick it or just use it as is.
      // A common workaround for "Line" is actually just standard polyline but user clicks "Finish"
      // or we auto-finish.
      //
      // Better approach for "Line Segment":
      // Some forks support maxGuideLineLength etc.
      // For standard Leaflet.draw, we can try extending it, but for now we'll use standard Polyline
      // and maybe guide the user.
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
    <MapDrawShapeButton
      drawMode="line"
      createDrawTool={createDrawTool}
      className={className}
      tooltipSide={tooltipSide}
    >
      <IconLine />
    </MapDrawShapeButton>
  )
}
