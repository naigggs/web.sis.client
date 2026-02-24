"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletPolyline = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({
    default: mod.Polyline,
  })),
)
