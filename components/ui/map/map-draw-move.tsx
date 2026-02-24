"use client"

import type { EditToolbar } from "leaflet"
import { IconDragDrop } from "@tabler/icons-react"

import { useLeaflet } from "@/hooks/use-leaftlet"

import { useMapDrawContext } from "./map-context"
import { MapDrawActionButton } from "./map-draw-action-button"

export function MapDrawMove({ ...props }: Omit<EditToolbar.EditHandlerOptions, "featureGroup">) {
  const { L } = useLeaflet()
  const drawContext = useMapDrawContext()

  if (!drawContext) {
    throw new Error("MapDrawMove must be used within MapDrawControl")
  }

  const createMoveTool = (L: any, map: any, featureGroup: any) => {
    return {
      enabled: false,
      dragging: false,
      startPoint: null as any,
      dragLayer: null as any,

      enable() {
        if (this.enabled) return
        this.enabled = true
        featureGroup.eachLayer((layer: any) => {
          if (layer.on) {
            layer.on("mousedown", this.onMouseDown, this)
            if (layer._path) {
              layer._path.classList.add("leaflet-interactive")
              layer._path.style.cursor = "move"
            }
          }
        })
      },

      disable() {
        if (!this.enabled) return
        this.enabled = false
        featureGroup.eachLayer((layer: any) => {
          if (layer.off) {
            layer.off("mousedown", this.onMouseDown, this)
            if (layer._path) {
              layer._path.style.cursor = ""
            }
          }
        })
        this.resetState(map)
      },

      onMouseDown(e: any) {
        if (!this.enabled) return

        this.dragging = true
        this.startPoint = e.latlng
        this.dragLayer = e.target

        map.dragging.disable()
        map.doubleClickZoom.disable()

        map.on("mousemove", this.onMouseMove, this)
        map.on("mouseup", this.onMouseUp, this)

        L.DomEvent.stop(e)
      },

      onMouseMove(e: any) {
        if (!this.dragging || !this.dragLayer || !this.startPoint) return

        const currentPoint = e.latlng
        const latDiff = currentPoint.lat - this.startPoint.lat
        const lngDiff = currentPoint.lng - this.startPoint.lng

        const translatePoint = (point: any) => ({
          lat: point.lat + latDiff,
          lng: point.lng + lngDiff,
        })

        const translateCoords = (coords: any): any => {
          if (Array.isArray(coords)) {
            if (coords.length > 0 && coords[0].lat !== undefined) {
              return coords.map(translatePoint)
            } else {
              return coords.map(translateCoords)
            }
          } else if (coords && coords.lat !== undefined) {
            return translatePoint(coords)
          }
          return coords
        }

        const newLatLngs = translateCoords(this.dragLayer.getLatLngs())
        this.dragLayer.setLatLngs(newLatLngs)
        this.startPoint = currentPoint

        L.DomEvent.preventDefault(e)
        L.DomEvent.stopPropagation(e)
      },

      onMouseUp(_e: any) {
        this.resetState(map)
      },

      resetState(map: any) {
        this.dragging = false
        this.startPoint = null
        this.dragLayer = null

        map.dragging.enable()
        map.doubleClickZoom.enable()

        map.off("mousemove", this.onMouseMove, this)
        map.off("mouseup", this.onMouseUp, this)
      },

      save() {},

      revertLayers() {},
      removeAllLayers() {},
    }
  }

  return (
    <MapDrawActionButton
      drawAction="move"
      controlRef={drawContext.editControlRef as any}
      createDrawTool={createMoveTool as any}
    >
      <IconDragDrop />
    </MapDrawActionButton>
  )
}
