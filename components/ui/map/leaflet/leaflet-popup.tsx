"use client"

import { createLazyComponent } from "./create-lazy-component"

export const LeafletPopup = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({
    default: mod.Popup,
  })),
)
