"use client"

import * as React from "react"
import { IconCompass } from "@tabler/icons-react"
import { useMapEvents } from "react-leaflet"

import { cn } from "@/lib/utils"

export function MapInfoControl({ className }: { className?: string }) {
  const [center, setCenter] = React.useState<{ lat: number; lng: number } | null>(null)

  const map = useMapEvents({
    move: () => {
      setCenter(map.getCenter())
    },
    moveend: () => {
      setCenter(map.getCenter())
    },
  })

  React.useEffect(() => {
    if (map) {
      setCenter(map.getCenter())
    }
  }, [map])

  if (!center) return null

  return (
    <div
      className={cn(
        "bg-background text-foreground absolute top-4 right-4 z-400 flex items-center gap-2 rounded-lg p-2 text-xs font-medium",
        className,
      )}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 tabular-nums">
        <IconCompass className="text-muted-foreground size-4" />
        Lat: {center.lat.toFixed(6)}, Lng: {center.lng.toFixed(6)}
      </div>
    </div>
  )
}
