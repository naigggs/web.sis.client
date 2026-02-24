"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletCircleMarker = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({
    default: mod.CircleMarker,
  })),
)
