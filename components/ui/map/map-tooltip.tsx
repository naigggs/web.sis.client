"use client"

import type { Ref } from "react"
import type { TooltipProps } from "react-leaflet"
import type { PointExpression, Tooltip } from "leaflet"

import { cn } from "@/lib/utils"
import { LeafletTooltip } from "@/components/ui"

export function MapTooltip({
  className,
  children,
  side = "top",
  sideOffset = 15,
  ...props
}: Omit<TooltipProps, "offset"> & {
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
  ref?: Ref<Tooltip>
}) {
  const ARROW_POSITION_CLASSES = {
    top: "bottom-0.5 left-1/2 -translate-x-1/2 translate-y-1/2",
    bottom: "top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2",
    left: "right-0.5 top-1/2 translate-x-1/2 -translate-y-1/2",
    right: "left-0.5 top-1/2 -translate-x-1/2 -translate-y-1/2",
  }
  const DEFAULT_OFFSET = {
    top: [0, -sideOffset] satisfies PointExpression,
    bottom: [0, sideOffset] satisfies PointExpression,
    left: [-sideOffset, 0] satisfies PointExpression,
    right: [sideOffset, 0] satisfies PointExpression,
  }

  return (
    <LeafletTooltip
      className={cn(
        "animate-in fade-in-0 zoom-in-95 fade-out-0 zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 w-fit text-xs text-balance transition-opacity",
        className,
      )}
      data-side={side}
      direction={side}
      offset={DEFAULT_OFFSET[side]}
      opacity={1}
      {...props}
    >
      {children}
      <div
        className={cn(
          "bg-foreground fill-foreground absolute z-50 size-2.5 rotate-45 rounded-[2px]",
          ARROW_POSITION_CLASSES[side],
        )}
      />
    </LeafletTooltip>
  )
}
