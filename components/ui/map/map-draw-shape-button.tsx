"use client"

import * as React from "react"
import { useMap } from "react-leaflet"
import type { Draw, DrawMap } from "leaflet"

import { cn } from "@/lib/utils"
import { useLeaflet } from "@/hooks/use-leaftlet"
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui"

import { useMapDrawContext, type MapDrawShape } from "./map-context"

export function MapDrawShapeButton<T extends Draw.Feature>({
  drawMode,
  createDrawTool,
  className,
  tooltipSide = "top",
  ...props
}: React.ComponentProps<"button"> & {
  drawMode: MapDrawShape
  createDrawTool: (L: typeof import("leaflet"), map: DrawMap) => T
  tooltipSide?: React.ComponentProps<typeof TooltipContent>["side"]
}) {
  const drawContext = useMapDrawContext()
  if (!drawContext) {
    throw new Error("MapDrawShapeButton must be used within MapDrawControl")
  }
  const { L } = useLeaflet()
  const map = useMap()
  const controlRef = React.useRef<T | null>(null)
  const { activeMode, setActiveMode } = drawContext
  const isActive = activeMode === drawMode

  React.useEffect(() => {
    if (!L || !isActive) {
      controlRef.current?.disable()
      controlRef.current = null
      return
    }
    const control = createDrawTool(L, map as DrawMap)
    control.enable()
    controlRef.current = control
    return () => {
      control.disable()
      controlRef.current = null
    }
  }, [L, map, isActive, createDrawTool])

  function handleClick() {
    setActiveMode(isActive ? null : drawMode)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          aria-label={`Draw ${drawMode}`}
          className={className}
          variant={isActive ? "default" : "outline"}
          disabled={activeMode === "edit" || activeMode === "delete"}
          onClick={handleClick}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>Draw {drawMode}</TooltipContent>
    </Tooltip>
  )
}
