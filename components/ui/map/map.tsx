"use client"

import * as React from "react"
import type { MapContainerProps } from "react-leaflet"
import type { LatLngExpression, Map as LeafletMap } from "leaflet"
import "leaflet-draw/dist/leaflet.draw.css"
import "leaflet.fullscreen/dist/Control.FullScreen.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet/dist/leaflet.css"

import { cn } from "@/lib/utils"
import { LeafletMapContainer, createLazyComponent } from "@/components/ui"

const MapRefHandler = createLazyComponent(() => import("./leaflet/map-ref-handler"))

export function Map({
  zoom = 15,
  maxZoom = 18,
  className,
  children,
  ref,
  ...props
}: Omit<MapContainerProps, "zoomControl"> & {
  center: LatLngExpression
  ref?: React.Ref<LeafletMap>
}) {
  const handleMapReady = React.useCallback(
    (map: LeafletMap) => {
      if (typeof ref === "function") {
        ref(map)
      } else if (ref) {
        ref.current = map
      }
    },
    [ref],
  )

  return (
    <LeafletMapContainer
      zoom={zoom}
      maxZoom={maxZoom}
      attributionControl={false}
      zoomControl={false}
      className={cn("size-full min-h-96 flex-1", className)}
      {...props}
    >
      <MapRefHandler onMapReady={handleMapReady} />
      {children}
    </LeafletMapContainer>
  )
}
