"use client"

import * as React from "react"
import { useMap } from "react-leaflet"
import type { LatLngExpression, LocateOptions, LocationEvent, ErrorEvent } from "leaflet"
import { IconLoader2, IconNavigation } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { useVisualizer } from "@/hooks/use-visualizer"
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui"

import { MapMarker } from "./map-marker"
import { useDebounceLoadingState } from "./map-hooks"

function MapLocatePulseIcon() {
  return (
    <div className="absolute -top-1 -right-1 flex size-3 rounded-full">
      <div className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-75" />
      <div className="bg-primary relative inline-flex size-3 rounded-full" />
    </div>
  )
}

export type MapLocateButtonProps = React.ComponentProps<"button"> &
  Pick<LocateOptions, "watch"> & {
    onLocationFound?: (location: LocationEvent) => void
    onLocationError?: (error: ErrorEvent) => void
  }

export function MapLocateButton({
  className,
  watch = false,
  onLocationFound,
  onLocationError,
  ...props
}: MapLocateButtonProps) {
  const map = useMap()
  const { isCanvasLocked } = useVisualizer()
  const [isLocating, setIsLocating] = useDebounceLoadingState(200)
  const [position, setPosition] = React.useState<LatLngExpression | null>(null)

  function startLocating() {
    setIsLocating(true)
    map.locate({ setView: true, maxZoom: map.getMaxZoom(), watch })
    map.on("locationfound", (location: LocationEvent) => {
      setPosition(location.latlng)
      setIsLocating(false)
      onLocationFound?.(location)
    })
    map.on("locationerror", (error: ErrorEvent) => {
      setPosition(null)
      setIsLocating(false)
      onLocationError?.(error)
    })
  }

  function stopLocating() {
    map.stopLocate()
    map.off("locationfound")
    map.off("locationerror")
    setPosition(null)
    setIsLocating(false)
  }

  React.useEffect(() => () => stopLocating(), [])

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            onClick={position ? stopLocating : startLocating}
            disabled={isLocating || isCanvasLocked}
            aria-label={
              isLocating
                ? "Locating..."
                : position
                  ? "Stop location tracking"
                  : "Start location tracking"
            }
            className={cn("bg-background hover:bg-accent hover:text-accent-foreground", className)}
            {...props}
          >
            {isLocating ? <IconLoader2 className="animate-spin" /> : <IconNavigation />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          {isLocating ? "Locating..." : position ? "Stop tracking" : "Track location"}
        </TooltipContent>
      </Tooltip>
      {position && <MapMarker position={position} icon={<MapLocatePulseIcon />} />}
    </>
  )
}
