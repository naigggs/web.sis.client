"use client"

import * as React from "react"
import { useMap } from "react-leaflet"
import { IconMaximize, IconMinimize } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { useLeaflet } from "@/hooks/use-leaftlet"
import { Button } from "@/components/ui"

import { MapControlContainer } from "./map-control-container"

export function MapFullscreenControl({ className, ...props }: React.ComponentProps<"button">) {
  const map = useMap()
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const { L } = useLeaflet()

  React.useEffect(() => {
    if (!L) return

    const fullscreenControl = new L.Control.FullScreen()
    fullscreenControl.addTo(map)

    const container = fullscreenControl.getContainer()
    if (container) {
      container.style.display = "none"
    }

    const handleEnter = () => setIsFullscreen(true)
    const handleExit = () => setIsFullscreen(false)

    map.on("enterFullscreen", handleEnter)
    map.on("exitFullscreen", handleExit)

    return () => {
      fullscreenControl.remove()
      map.off("enterFullscreen", handleEnter)
      map.off("exitFullscreen", handleExit)
    }
  }, [L, map])

  return (
    <MapControlContainer className={cn("top-1 right-1", className)}>
      <Button
        type="button"
        size="icon-sm"
        variant="secondary"
        onClick={() => map.toggleFullscreen()}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        className="border"
        {...props}
      >
        {isFullscreen ? <IconMinimize /> : <IconMaximize />}
      </Button>
    </MapControlContainer>
  )
}
