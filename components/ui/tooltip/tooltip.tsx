"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { TooltipProvider } from "@/providers/tooltip-provider"

export function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}
