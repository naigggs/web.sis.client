"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletMarker = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({
    default: mod.Marker,
  })),
)
