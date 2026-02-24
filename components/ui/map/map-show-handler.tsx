"use client"

import { cn } from "@/lib/utils"
import { useVisualizer } from "@/hooks/use-visualizer"
import { LeafletTileLayer } from "@/components/ui"

export function MapShowHandler() {
  const { showMap } = useVisualizer()

  if (!showMap) return null

  return (
    <LeafletTileLayer
      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      maxNativeZoom={19}
      maxZoom={24}
      className={cn("z-0 opacity-30 transition-opacity duration-300")}
    />
  )
}
