"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletTooltip = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({
    default: mod.Tooltip,
  })),
)
