"use client"

import { useEffect } from "react"
import type { Map as LeafletMap } from "leaflet"
import { useMap } from "react-leaflet"

export default function MapRefHandler({ onMapReady }: { onMapReady: (map: LeafletMap) => void }) {
  const map = useMap()

  useEffect(() => {
    if (map) {
      onMapReady(map)
    }
  }, [map, onMapReady])

  useEffect(() => {
    if (!map) return

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
    })

    resizeObserver.observe(map.getContainer())

    return () => {
      resizeObserver.disconnect()
    }
  }, [map])

  return null
}
