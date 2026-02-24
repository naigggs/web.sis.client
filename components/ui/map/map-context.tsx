"use client"

import * as React from "react"
import type { CheckboxItem } from "@radix-ui/react-dropdown-menu"
import type { EditToolbar } from "leaflet"

export interface MapTileLayerOption {
  name: string
  url: string
  attribution?: string
}

export interface MapLayerGroupOption extends Pick<
  React.ComponentProps<typeof CheckboxItem>,
  "disabled"
> {
  name: string
}

export interface MapLayersContextType {
  registerTileLayer: (layer: MapTileLayerOption) => void
  tileLayers: MapTileLayerOption[]
  selectedTileLayer: string
  setSelectedTileLayer: (name: string) => void
  registerLayerGroup: (layer: MapLayerGroupOption) => void
  layerGroups: MapLayerGroupOption[]
  activeLayerGroups: string[]
  setActiveLayerGroups: (names: string[]) => void
}

export const MapLayersContext = React.createContext<MapLayersContextType | null>(null)

export function useMapLayersContext() {
  return React.useContext(MapLayersContext)
}

export type MapDrawShape =
  | "marker"
  | "polyline"
  | "circle"
  | "rectangle"
  | "polygon"
  | "line"
  | "chair"
  | "bed"
  | "bathtub"
  | "diningTable"
  | "sofa"
  | "sofaSingle"
  | "table"
  | "toilet"
  | "sink"
  | "wardrobe"
  | "cabinet"
  | "door"
export type MapDrawAction = "edit" | "delete" | "move"
export type MapDrawMode = MapDrawShape | MapDrawAction | null

export interface MapDrawContextType {
  readonly featureGroup: L.FeatureGroup | null
  activeMode: MapDrawMode
  setActiveMode: (mode: MapDrawMode) => void
  readonly editControlRef: React.RefObject<EditToolbar.Edit | null>
  readonly deleteControlRef: React.RefObject<EditToolbar.Delete | null>
  readonly layersCount: number
}

export const MapDrawContext = React.createContext<MapDrawContextType | null>(null)

export function useMapDrawContext() {
  return React.useContext(MapDrawContext)
}
