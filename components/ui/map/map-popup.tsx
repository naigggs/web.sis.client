"use client"

import type { Ref } from "react"
import type { PopupProps } from "react-leaflet"
import type { Popup } from "leaflet"

import { cn } from "@/lib/utils"
import { LeafletPopup } from "@/components/ui"

export function MapPopup({
  className,
  ...props
}: Omit<PopupProps, "content"> & { ref?: Ref<Popup> }) {
  return (
    <LeafletPopup
      className={cn(
        "bg-popover text-popover-foreground animate-in fade-out-0 fade-in-0 zoom-out-95 zoom-in-95 slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 font-sans shadow-md outline-hidden",
        className,
      )}
      {...props}
    />
  )
}
