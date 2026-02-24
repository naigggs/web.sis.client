"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletLayerGroup = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({
    default: mod.LayerGroup,
  })),
)
