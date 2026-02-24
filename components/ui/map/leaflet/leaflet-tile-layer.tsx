"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletTileLayer = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({
    default: mod.TileLayer,
  })),
)
