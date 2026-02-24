"use client"

import * as React from "react"

import { MapLayersContext, type MapTileLayerOption, type MapLayerGroupOption } from "./map-context"

export function MapLayers({
  defaultTileLayer,
  defaultLayerGroups = [],
  ...props
}: Omit<React.ComponentProps<typeof MapLayersContext.Provider>, "value"> & {
  defaultTileLayer?: string
  defaultLayerGroups?: string[]
}) {
  const [tileLayers, setTileLayers] = React.useState<MapTileLayerOption[]>([])
  const [selectedTileLayer, setSelectedTileLayer] = React.useState<string>(defaultTileLayer || "")
  const [layerGroups, setLayerGroups] = React.useState<MapLayerGroupOption[]>([])
  const [activeLayerGroups, setActiveLayerGroups] = React.useState<string[]>(defaultLayerGroups)

  function registerTileLayer(tileLayer: MapTileLayerOption) {
    setTileLayers((prevTileLayers) => {
      if (prevTileLayers.some((layer) => layer.name === tileLayer.name)) {
        return prevTileLayers
      }
      return [...prevTileLayers, tileLayer]
    })
  }

  function registerLayerGroup(layerGroup: MapLayerGroupOption) {
    setLayerGroups((prevLayerGroups) => {
      if (prevLayerGroups.some((group) => group.name === layerGroup.name)) {
        return prevLayerGroups
      }
      return [...prevLayerGroups, layerGroup]
    })
  }

  React.useEffect(() => {
    if (
      defaultTileLayer &&
      tileLayers.length > 0 &&
      !tileLayers.some((tileLayer) => tileLayer.name === defaultTileLayer)
    ) {
      throw new Error(
        `Invalid defaultTileLayer "${defaultTileLayer}" provided to MapLayers. It must match a MapTileLayer's name prop.`,
      )
    }

    if (tileLayers.length > 0 && !selectedTileLayer) {
      const validDefaultValue =
        defaultTileLayer && tileLayers.some((layer) => layer.name === defaultTileLayer)
          ? defaultTileLayer
          : tileLayers[0].name
      setSelectedTileLayer(validDefaultValue)
    }

    if (
      defaultLayerGroups.length > 0 &&
      layerGroups.length > 0 &&
      defaultLayerGroups.some((name) => !layerGroups.some((group) => group.name === name))
    ) {
      throw new Error(
        `Invalid defaultLayerGroups value provided to MapLayers. All names must match a MapLayerGroup's name prop.`,
      )
    }
  }, [tileLayers, defaultTileLayer, selectedTileLayer, layerGroups, defaultLayerGroups])

  return (
    <MapLayersContext.Provider
      value={{
        registerTileLayer,
        tileLayers,
        selectedTileLayer,
        setSelectedTileLayer,
        registerLayerGroup,
        layerGroups,
        activeLayerGroups,
        setActiveLayerGroups,
      }}
      {...props}
    />
  )
}
