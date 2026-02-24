"use client"

import * as React from "react"
import { useMap, useMapEvents } from "react-leaflet"

import { useLeaflet } from "@/hooks/use-leaftlet"
import { useMapDrawContext, type MapDrawMode } from "./map-context"
import { FURNITURE_SIZES } from "@/lib/constants"

const FURNITURE_TYPES = [
  "chair",
  "bed",
  "bathtub",
  "diningTable",
  "sofa",
  "sofaSingle",
  "table",
  "toilet",
  "sink",
  "wardrobe",
  "cabinet",
  "door",
] as const
type FurnitureType = (typeof FURNITURE_TYPES)[number]

function isFurnitureType(mode: MapDrawMode): mode is FurnitureType {
  return mode !== null && FURNITURE_TYPES.includes(mode as FurnitureType)
}

export function MapStampHandler() {
  const { L } = useLeaflet()
  const map = useMap()
  const context = useMapDrawContext()
  const previewRef = React.useRef<L.Rectangle | null>(null)
  const labelRef = React.useRef<L.Tooltip | null>(null)

  const activeMode = context?.activeMode ?? null
  const isFurnitureMode = isFurnitureType(activeMode)

  // Cursor style when in furniture stamp mode
  React.useEffect(() => {
    const container = map.getContainer()
    if (isFurnitureMode) {
      container.style.cursor = "crosshair"
    } else {
      container.style.cursor = ""
    }
    return () => {
      container.style.cursor = ""
    }
  }, [map, isFurnitureMode])

  // Preview rectangle following cursor
  React.useEffect(() => {
    if (!L || !isFurnitureMode || !activeMode) return

    const furniture = FURNITURE_SIZES[activeMode]
    if (!furniture) return

    function handleMouseMove(e: L.LeafletMouseEvent) {
      if (!L) return
      const { lat, lng } = e.latlng
      const bounds = L.latLngBounds(
        [lat - furniture.height / 2, lng - furniture.width / 2],
        [lat + furniture.height / 2, lng + furniture.width / 2],
      )

      if (!previewRef.current) {
        previewRef.current = L.rectangle(bounds, {
          color: "var(--color-primary)",
          weight: 2,
          fillOpacity: 0.3,
          dashArray: "5, 5",
        }).addTo(map)

        labelRef.current = L.tooltip({
          permanent: true,
          direction: "center",
          className: "furniture-label",
        })
          .setContent(furniture.label)
          .setLatLng(e.latlng)
        previewRef.current.bindTooltip(labelRef.current)
      } else {
        previewRef.current.setBounds(bounds)
        labelRef.current?.setLatLng(e.latlng)
      }
    }

    function handleMouseOut() {
      if (previewRef.current) {
        previewRef.current.remove()
        previewRef.current = null
        labelRef.current = null
      }
    }

    map.on("mousemove", handleMouseMove)
    map.on("mouseout", handleMouseOut)

    return () => {
      map.off("mousemove", handleMouseMove)
      map.off("mouseout", handleMouseOut)
      if (previewRef.current) {
        previewRef.current.remove()
        previewRef.current = null
        labelRef.current = null
      }
    }
  }, [L, map, isFurnitureMode, activeMode])

  // Handle click to place furniture
  useMapEvents({
    click(e) {
      if (!L || !isFurnitureMode || !activeMode || !context) return

      const furniture = FURNITURE_SIZES[activeMode]
      if (!furniture) return

      const { featureGroup, setActiveMode } = context
      if (!featureGroup) return

      const { lat, lng } = e.latlng
      const bounds = L.latLngBounds(
        [lat - furniture.height / 2, lng - furniture.width / 2],
        [lat + furniture.height / 2, lng + furniture.width / 2],
      )

      const layer = L.rectangle(bounds, {
        color: "var(--color-primary)",
        weight: 2,
        fillOpacity: 0.2,
      })

      // Add label to the placed furniture
      layer.bindTooltip(furniture.label, {
        permanent: true,
        direction: "center",
        className: "furniture-label",
      })

      // Store furniture type on layer
      // @ts-ignore
      layer._furnitureType = activeMode

      featureGroup.addLayer(layer)

      // Clear the preview after placing
      if (previewRef.current) {
        previewRef.current.remove()
        previewRef.current = null
        labelRef.current = null
      }
    },
  })

  return null
}
