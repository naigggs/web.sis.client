"use client"

import * as React from "react"
import type { ReactNode, Ref } from "react"
import { renderToString } from "react-dom/server"
import type { MarkerProps } from "react-leaflet"
import type { DivIconOptions, Marker } from "leaflet"
import { IconMapPin } from "@tabler/icons-react"

import { useLeaflet } from "@/hooks/use-leaftlet"
import { LeafletMarker } from "@/components/ui"

export function MapMarker({
  icon = <IconMapPin className="size-6" />,
  iconAnchor = [12, 12],
  bgPos,
  popupAnchor,
  tooltipAnchor,
  ...props
}: Omit<MarkerProps, "icon"> &
  Pick<DivIconOptions, "iconAnchor" | "bgPos" | "popupAnchor" | "tooltipAnchor"> & {
    icon?: ReactNode
    ref?: Ref<Marker>
  }) {
  const { L } = useLeaflet()
  if (!L) return null

  return (
    <LeafletMarker
      icon={L.divIcon({
        html: renderToString(icon),
        iconAnchor,
        ...(bgPos ? { bgPos } : {}),
        ...(popupAnchor ? { popupAnchor } : {}),
        ...(tooltipAnchor ? { tooltipAnchor } : {}),
      })}
      riseOnHover
      {...props}
    />
  )
}
