"use client"

import * as React from "react"
import { useMap } from "react-leaflet"

import { useVisualizer } from "@/hooks/use-visualizer"

export function MapLockHandler() {
  const map = useMap()
  const { isCanvasLocked } = useVisualizer()

  React.useEffect(() => {
    if (!map) return

    if (isCanvasLocked) {
      map.dragging.disable()
      map.touchZoom.disable()
      map.doubleClickZoom.disable()
      map.scrollWheelZoom.disable()
      map.boxZoom.disable()
      map.keyboard.disable()
    } else {
      map.dragging.enable()
      map.touchZoom.enable()
      map.scrollWheelZoom.enable()
      map.boxZoom.enable()
      map.keyboard.enable()
    }
  }, [map, isCanvasLocked])

  return null
}
