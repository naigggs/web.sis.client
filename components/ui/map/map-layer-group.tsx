"use client"

import * as React from "react"
import type { Ref } from "react"
import type { LayerGroupProps } from "react-leaflet"
import type { LayerGroup } from "leaflet"

import { MapLayersContext, type MapLayerGroupOption } from "./map-context"
import { LeafletLayerGroup } from "@/components/ui/"

export function MapLayerGroup({
  name,
  disabled,
  ...props
}: LayerGroupProps & MapLayerGroupOption & { ref?: Ref<LayerGroup> }) {
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

  return <LeafletLayerGroup {...props} />
}
