"use client"

import * as React from "react"
import { useMap } from "react-leaflet"

import { useLeaflet } from "@/hooks/use-leaftlet"
import { useMapDrawContext } from "./map-context"
import { MapLayerContextMenu } from "./map-layer-context-menu"
import type { SelectedLot } from "@/contexts/visualizer-context"

export function MapLayerRightClickHandler() {
  const { L } = useLeaflet()
  const map = useMap()
  const context = useMapDrawContext()

  const [menuPosition, setMenuPosition] = React.useState<{ x: number; y: number } | null>(null)
  const [menuLayerData, setMenuLayerData] = React.useState<SelectedLot | null>(null)

  React.useEffect(() => {
    if (!L || !context?.featureGroup) return

    const { featureGroup } = context

    function handleContextMenu(e: L.LeafletMouseEvent, layer: L.Layer) {
      e.originalEvent.preventDefault()

      // Extract layer data
      let coordinates: [number, number][] = []
      let center: [number, number] = [e.latlng.lat, e.latlng.lng]
      let area = 0

      if ("getLatLngs" in layer && typeof layer.getLatLngs === "function") {
        const latlngs = layer.getLatLngs()
        // Handle nested arrays (polygons)
        const flatLatLngs = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs
        coordinates = (flatLatLngs as L.LatLng[]).map((ll) => [ll.lat, ll.lng])

        if ("getCenter" in layer && typeof layer.getCenter === "function") {
          const c = layer.getCenter()
          center = [c.lat, c.lng]
        }

        // Calculate area if polygon
        if (L && L.GeometryUtil && typeof L.GeometryUtil.geodesicArea === "function") {
          area = L.GeometryUtil.geodesicArea(flatLatLngs as L.LatLng[])
        }
      }

      const layerData: SelectedLot = {
        id: (layer as any)._leaflet_id?.toString() || Date.now().toString(),
        coordinates,
        center,
        area,
      }

      setMenuPosition({ x: e.originalEvent.clientX, y: e.originalEvent.clientY })
      setMenuLayerData(layerData)
    }

    function addContextMenuToLayer(layer: L.Layer) {
      layer.on("contextmenu", (e) => handleContextMenu(e as L.LeafletMouseEvent, layer))
    }

    // Add handler to existing layers
    featureGroup.eachLayer(addContextMenuToLayer)

    // Add handler to new layers
    featureGroup.on("layeradd", (e: L.LayerEvent) => {
      addContextMenuToLayer(e.layer)
    })

    return () => {
      featureGroup.eachLayer((layer) => {
        layer.off("contextmenu")
      })
      featureGroup.off("layeradd")
    }
  }, [L, context?.featureGroup])

  function handleCloseMenu() {
    setMenuPosition(null)
    setMenuLayerData(null)
  }

  return (
    <MapLayerContextMenu
      position={menuPosition}
      layerData={menuLayerData}
      onClose={handleCloseMenu}
    />
  )
}
