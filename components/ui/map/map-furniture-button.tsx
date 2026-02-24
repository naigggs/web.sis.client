"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui"

import { useMapDrawContext, type MapDrawShape } from "./map-context"

interface MapFurnitureButtonProps {
  className?: string
  label: string
  type: MapDrawShape
  children?: React.ReactNode
}

export function MapFurnitureButton({ className, label, children, type }: MapFurnitureButtonProps) {
  const context = useMapDrawContext()
  const isActive = context?.activeMode === type

  function handleClick() {
    if (!context) return
    context.setActiveMode(isActive ? null : type)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          variant={isActive ? "default" : "outline"}
          className={cn("group aspect-square size-auto p-2", className)}
          aria-label={`Place ${label}`}
          onClick={handleClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{isActive ? `Cancel ${label}` : `Place ${label}`}</TooltipContent>
    </Tooltip>
  )
}
