"use client"

import * as React from "react"
import type { Ref } from "react"
import { useTheme } from "next-themes"
import { useMap, type TileLayerProps } from "react-leaflet"
import type { TileLayer } from "leaflet"

import { MapLayersContext } from "./map-context"
import { LeafletTileLayer } from "@/components/ui"

export function MapTileLayer({
  name = "Default",
  url,
  attribution,
  darkUrl,
  darkAttribution,
  ...props
}: Partial<TileLayerProps> & {
  name?: string
  darkUrl?: string
  darkAttribution?: string
  ref?: Ref<TileLayer>
}) {
  const map = useMap()
  if (map.attributionControl) {
    map.attributionControl.setPrefix("")
  }

  const context = React.useContext(MapLayersContext)
  const DEFAULT_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
  const DEFAULT_DARK_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"

  const { resolvedTheme } = useTheme()
  const resolvedUrl =
    resolvedTheme === "dark" ? (darkUrl ?? url ?? DEFAULT_DARK_URL) : (url ?? DEFAULT_URL)
  const resolvedAttribution =
    resolvedTheme === "dark" && darkAttribution
      ? darkAttribution
      : (attribution ??
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>')

  React.useEffect(() => {
    if (context) {
      context.registerTileLayer({
        name,
        url: resolvedUrl,
        attribution: resolvedAttribution,
      })
    }
  }, [context, name, url, attribution])

  if (context && context.selectedTileLayer !== name) {
    return null
  }

  return <LeafletTileLayer url={resolvedUrl} attribution={resolvedAttribution} {...props} />
}
