"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletPolygon = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({
    default: mod.Polygon,
  })),
)
