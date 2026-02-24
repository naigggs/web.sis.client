"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletMapContainer = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({
    default: mod.MapContainer,
  })),
)
