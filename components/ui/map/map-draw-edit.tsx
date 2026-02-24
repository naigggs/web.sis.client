"use client"

import * as React from "react"
import type { EditToolbar } from "leaflet"
import { IconPencil } from "@tabler/icons-react"

import { useLeaflet } from "@/hooks/use-leaftlet"

import { useMapDrawContext } from "./map-context"
import { MapDrawActionButton } from "./map-draw-action-button"
import { useMapDrawHandleIcon } from "./map-hooks"

export function MapDrawEdit({
  selectedPathOptions = {
    color: "var(--color-primary)",
    fillColor: "var(--color-primary)",
    weight: 2,
  },
  ...props
}: Omit<EditToolbar.EditHandlerOptions, "featureGroup">) {
  const { L } = useLeaflet()
  const mapDrawHandleIcon = useMapDrawHandleIcon()
  const drawContext = useMapDrawContext()
  if (!drawContext) {
    throw new Error("MapDrawEdit must be used within MapDrawControl")
  }

  React.useEffect(() => {
    if (!L || !mapDrawHandleIcon) return

    L.Edit.PolyVerticesEdit.mergeOptions({
      icon: mapDrawHandleIcon,
      touchIcon: mapDrawHandleIcon,
      drawError: {
        color: "var(--color-destructive)",
      },
    })
    L.Edit.SimpleShape.mergeOptions({
      moveIcon: mapDrawHandleIcon,
      resizeIcon: mapDrawHandleIcon,
      touchMoveIcon: mapDrawHandleIcon,
      touchResizeIcon: mapDrawHandleIcon,
    })
    L.drawLocal.edit.handlers.edit.tooltip = {
      text: "Drag handles or markers to edit.",
      subtext: "",
    }
    L.drawLocal.edit.handlers.remove.tooltip = {
      text: "Click on a shape to remove.",
    }
  }, [mapDrawHandleIcon])

  return (
    <MapDrawActionButton
      drawAction="edit"
      controlRef={drawContext.editControlRef}
      createDrawTool={(L, map, featureGroup) =>
        new L.EditToolbar.Edit(map, {
          featureGroup,
          selectedPathOptions,
          ...props,
        })
      }
    >
      <IconPencil />
    </MapDrawActionButton>
  )
}
