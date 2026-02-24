"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletMarkerClusterGroup = createLazyComponent(async () =>
  import("react-leaflet-markercluster").then((mod) => ({
    default: mod.default,
  })),
)
