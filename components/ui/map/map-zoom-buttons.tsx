"use client"

import { IconMinus, IconPlus } from "@tabler/icons-react"
import { useMap } from "react-leaflet"

import { useVisualizer } from "@/hooks/use-visualizer"
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui"

export function MapZoomButtons() {
  const map = useMap()
  const { isCanvasLocked } = useVisualizer()

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={() => map.zoomIn()}
            disabled={isCanvasLocked}
            aria-label="Zoom in"
            className="bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <IconPlus className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Zoom in</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={() => map.zoomOut()}
            disabled={isCanvasLocked}
            aria-label="Zoom out"
            className="bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <IconMinus className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Zoom out</TooltipContent>
      </Tooltip>
    </>
  )
}
