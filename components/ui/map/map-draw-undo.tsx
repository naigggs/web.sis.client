"use client"

import * as React from "react"
import { IconArrowBackUp } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui"

import { useMapDrawContext } from "./map-context"

export function MapDrawUndo({ className, ...props }: React.ComponentProps<"button">) {
  const drawContext = useMapDrawContext()
  if (!drawContext) throw new Error("MapDrawUndo must be used within MapDrawControl")

  const { activeMode, setActiveMode, editControlRef, deleteControlRef, layersCount } = drawContext
  const isInEditMode = activeMode === "edit"
  const isInDeleteMode = activeMode === "delete"
  const isActive = (isInEditMode || isInDeleteMode) && layersCount > 0

  function handleUndo() {
    if (isInEditMode) {
      editControlRef.current?.revertLayers()
    } else if (isInDeleteMode) {
      deleteControlRef.current?.revertLayers()
    }
    setActiveMode(null)
  }

  return (
    <Button
      type="button"
      size="icon-sm"
      variant="secondary"
      aria-label={`Undo ${activeMode}`}
      title={`Undo ${activeMode}`}
      onClick={handleUndo}
      disabled={!isActive}
      className={cn("border", className)}
      {...props}
    >
      <IconArrowBackUp />
    </Button>
  )
}
