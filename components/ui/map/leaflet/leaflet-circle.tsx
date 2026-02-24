"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletCircle = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({
    default: mod.Circle,
  })),
)
