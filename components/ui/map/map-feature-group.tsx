"use client"

import * as React from "react"
import type { Ref } from "react"
import type { LayerGroupProps } from "react-leaflet"
import type { FeatureGroup } from "leaflet"

import { MapLayersContext, type MapLayerGroupOption } from "./map-context"
import { LeafletFeatureGroup } from "@/components/ui"

export function MapFeatureGroup({
  name,
  disabled,
  ...props
}: LayerGroupProps & MapLayerGroupOption & { ref?: Ref<FeatureGroup> }) {
  const context = React.useContext(MapLayersContext)

  React.useEffect(() => {
    if (context) {
      context.registerLayerGroup({
        name,
        disabled,
      })
    }
  }, [context, name, disabled])

  if (context && !context.activeLayerGroups.includes(name)) {
    return null
  }

  return <LeafletFeatureGroup {...props} />
}
