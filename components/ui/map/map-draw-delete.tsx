"use client"

import { IconTrash } from "@tabler/icons-react"

import { useMapDrawContext } from "./map-context"
import { MapDrawActionButton } from "./map-draw-action-button"

export function MapDrawDelete() {
  const drawContext = useMapDrawContext()
  if (!drawContext) {
    throw new Error("MapDrawDelete must be used within MapDrawControl")
  }

  return (
    <MapDrawActionButton
      drawAction="delete"
      controlRef={drawContext.deleteControlRef}
      createDrawTool={(L, map, featureGroup) => new L.EditToolbar.Delete(map, { featureGroup })}
    >
      <IconTrash />
    </MapDrawActionButton>
  )
}
