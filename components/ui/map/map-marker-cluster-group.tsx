"use client"

import type { ReactNode } from "react"
import { renderToString } from "react-dom/server"
import type { MarkerClusterGroupProps } from "react-leaflet-markercluster"
import type { MarkerCluster } from "leaflet"

import { useLeaflet } from "@/hooks/use-leaftlet"

import { LeafletMarkerClusterGroup } from "@/components/ui"

export function MapMarkerClusterGroup({
  polygonOptions = {
    className: "fill-foreground stroke-foreground stroke-2",
  },
  spiderLegPolylineOptions = {
    className: "fill-foreground stroke-foreground stroke-2",
  },
  icon,
  ...props
}: Omit<MarkerClusterGroupProps, "iconCreateFunction"> & {
  children: ReactNode
  icon?: (markerCount: number) => ReactNode
}) {
  const { L } = useLeaflet()
  if (!L) return null

  const iconCreateFunction = icon
    ? (cluster: MarkerCluster) => {
        const markerCount = cluster.getChildCount()
        const iconNode = icon(markerCount)
        return L.divIcon({
          html: renderToString(iconNode),
        })
      }
    : undefined

  return (
    <LeafletMarkerClusterGroup
      polygonOptions={polygonOptions}
      spiderLegPolylineOptions={spiderLegPolylineOptions}
      iconCreateFunction={iconCreateFunction}
      {...props}
    />
  )
}
