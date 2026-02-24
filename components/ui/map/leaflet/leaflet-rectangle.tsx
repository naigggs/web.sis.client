"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletRectangle = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({
    default: mod.Rectangle,
  })),
)
