"use client"

import * as React from "react"
import { useMap } from "react-leaflet"

import { useLeaflet } from "@/hooks/use-leaftlet"
import { useMapDrawContext, type MapDrawShape } from "./map-context"

export function MapDropZone() {
  const { L } = useLeaflet()
  const map = useMap()
  const context = useMapDrawContext()

  React.useEffect(() => {
    if (!L || !context) return
    const { featureGroup } = context
    const container = map.getContainer()

    function handleDragOver(e: DragEvent) {
      e.preventDefault()
      e.dataTransfer!.dropEffect = "copy"
    }

    function handleDrop(e: DragEvent) {
      e.preventDefault()
      const type = e.dataTransfer!.getData("furniture-type") as MapDrawShape
      if (!type || !featureGroup || !L) return

      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const latlng = map.containerPointToLatLng([x, y])

      const delta = 0.000015
      const bounds = L.latLngBounds(
        [latlng.lat - delta, latlng.lng - delta],
        [latlng.lat + delta, latlng.lng + delta],
      )

      const layer = L.rectangle(bounds, {
        color: "var(--color-primary)",
        weight: 2,
        fillOpacity: 0.2,
      })

      // @ts-ignore
      layer.pm = layer.pm || {}
      // @ts-ignore
      layer._shapeType = type

      featureGroup.addLayer(layer)
    }

    container.addEventListener("dragover", handleDragOver)
    container.addEventListener("drop", handleDrop)

    return () => {
      container.removeEventListener("dragover", handleDragOver)
      container.removeEventListener("drop", handleDrop)
    }
  }, [L, map, context])

  return null
}
