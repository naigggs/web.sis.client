"use client"

import * as React from "react"
import { useMap } from "react-leaflet"
import type { DrawEvents, EditToolbar } from "leaflet"

import { cn } from "@/lib/utils"
import { useLeaflet } from "@/hooks/use-leaftlet"
import { ButtonGroup } from "@/components/ui"

import { MapDrawContext, type MapDrawMode } from "./map-context"
import { MapControlContainer } from "./map-control-container"
import { LeafletFeatureGroup } from "@/components/ui"

export function MapDrawControl({
  className,
  onLayersChange,
  headless = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  onLayersChange?: (layers: L.FeatureGroup) => void
  headless?: boolean
}) {
  const { L, LeafletDraw } = useLeaflet()
  const map = useMap()
  const featureGroupRef = React.useRef<L.FeatureGroup | null>(null)
  const editControlRef = React.useRef<EditToolbar.Edit | null>(null)
  const deleteControlRef = React.useRef<EditToolbar.Delete | null>(null)
  const [activeMode, setActiveMode] = React.useState<MapDrawMode>(null)
  const [layersCount, setLayersCount] = React.useState(0)

  function updateLayersCount() {
    if (featureGroupRef.current) {
      setLayersCount(featureGroupRef.current.getLayers().length)
    }
  }

  function handleDrawCreated(event: DrawEvents.Created) {
    if (!featureGroupRef.current) return
    const { layer } = event
    featureGroupRef.current.addLayer(layer)
    onLayersChange?.(featureGroupRef.current)
    updateLayersCount()
    setActiveMode(null)
  }

  function handleDrawEditedOrDeleted() {
    if (!featureGroupRef.current) return
    onLayersChange?.(featureGroupRef.current)
    updateLayersCount()
    setActiveMode(null)
  }

  React.useEffect(() => {
    if (!L || !LeafletDraw || !map) return

    map.on(L.Draw.Event.CREATED, handleDrawCreated as L.LeafletEventHandlerFn)
    map.on(L.Draw.Event.EDITED, handleDrawEditedOrDeleted)
    map.on(L.Draw.Event.DELETED, handleDrawEditedOrDeleted)

    return () => {
      map.off(L.Draw.Event.CREATED, handleDrawCreated as L.LeafletEventHandlerFn)
      map.off(L.Draw.Event.EDITED, handleDrawEditedOrDeleted)
      map.off(L.Draw.Event.DELETED, handleDrawEditedOrDeleted)
    }
  }, [L, LeafletDraw, map, onLayersChange])

  return (
    <MapDrawContext.Provider
      value={{
        featureGroup: featureGroupRef.current,
        activeMode,
        setActiveMode,
        editControlRef,
        deleteControlRef,
        layersCount,
      }}
    >
      <LeafletFeatureGroup ref={featureGroupRef} />
      {headless ? (
        children
      ) : (
        <MapControlContainer className={cn("bottom-1 left-1", className)}>
          <ButtonGroup orientation="vertical" {...props} />
        </MapControlContainer>
      )}
    </MapDrawContext.Provider>
  )
}
