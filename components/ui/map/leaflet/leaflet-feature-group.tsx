"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletFeatureGroup = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({
    default: mod.FeatureGroup,
  })),
)
