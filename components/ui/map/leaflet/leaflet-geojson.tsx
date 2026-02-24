"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletGeoJSON = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({
    default: mod.GeoJSON,
  })),
)
