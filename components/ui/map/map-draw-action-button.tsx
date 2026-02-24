"use client"

import * as React from "react"
import { useMap } from "react-leaflet"
import type { DrawMap, EditToolbar } from "leaflet"

import { cn } from "@/lib/utils"
import { useLeaflet } from "@/hooks/use-leaftlet"
import { Button } from "@/components/ui"

import { useMapDrawContext, type MapDrawAction } from "./map-context"

export function MapDrawActionButton<T extends EditToolbar.Edit | EditToolbar.Delete>({
  drawAction,
  createDrawTool,
  controlRef,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  drawAction: MapDrawAction
  createDrawTool: (L: typeof import("leaflet"), map: DrawMap, featureGroup: L.FeatureGroup) => T
  controlRef: React.RefObject<T | null>
}) {
  const drawContext = useMapDrawContext()
  if (!drawContext) throw new Error("MapDrawActionButton must be used within MapDrawControl")

  const { L } = useLeaflet()
  const map = useMap()
  const { featureGroup, activeMode, setActiveMode, layersCount } = drawContext
  const isActive = activeMode === drawAction
  const hasFeatures = layersCount > 0

  React.useEffect(() => {
    if (!L || !featureGroup || !isActive) {
      controlRef.current?.disable?.()
      controlRef.current = null
      return
    }
    const control = createDrawTool(L, map as DrawMap, featureGroup)
    control.enable?.()
    controlRef.current = control
    return () => {
      control.disable?.()
      controlRef.current = null
    }
  }, [L, map, isActive, featureGroup, createDrawTool])

  function handleClick() {
    controlRef.current?.save()
    setActiveMode(isActive ? null : drawAction)
  }

  return (
    <Button
      type="button"
      size="icon-sm"
      aria-label={`${drawAction === "edit" ? "Edit" : "Remove"} shapes`}
      title={`${drawAction === "edit" ? "Edit" : "Remove"} shapes`}
      variant={isActive ? "default" : "secondary"}
      disabled={!hasFeatures}
      onClick={handleClick}
      className={cn("bg-background hover:bg-accent hover:text-accent-foreground", className)}
      {...props}
    />
  )
}
