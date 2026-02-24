"use client"

import * as React from "react"
import { IconStack } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui"

import { useMapLayersContext } from "./map-context"

export function MapLayersControl({
  tileLayersLabel = "Map Type",
  layerGroupsLabel = "Layers",
  className,
  ...props
}: React.ComponentProps<"button"> & {
  tileLayersLabel?: string
  layerGroupsLabel?: string
}) {
  const layersContext = useMapLayersContext()
  if (!layersContext) {
    throw new Error("MapLayersControl must be used within MapLayers")
  }

  const {
    tileLayers,
    selectedTileLayer,
    setSelectedTileLayer,
    layerGroups,
    activeLayerGroups,
    setActiveLayerGroups,
  } = layersContext

  if (tileLayers.length === 0 && layerGroups.length === 0) {
    return null
  }

  function handleLayerGroupToggle(name: string, checked: boolean) {
    setActiveLayerGroups(
      checked
        ? [...activeLayerGroups, name]
        : activeLayerGroups.filter((groupName) => groupName !== name),
    )
  }

  const showTileLayersDropdown = tileLayers.length > 1
  const showLayerGroupsDropdown = layerGroups.length > 0

  if (!showTileLayersDropdown && !showLayerGroupsDropdown) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label="Select layers"
          title="Select layers"
          className={cn("absolute top-1 right-1 z-1000 border", className)}
          {...props}
        >
          <IconStack />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-1000">
        {showTileLayersDropdown && (
          <>
            <DropdownMenuLabel>{tileLayersLabel}</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={selectedTileLayer} onValueChange={setSelectedTileLayer}>
              {tileLayers.map((tileLayer) => (
                <DropdownMenuRadioItem key={tileLayer.name} value={tileLayer.name}>
                  {tileLayer.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        )}
        {showTileLayersDropdown && showLayerGroupsDropdown && <DropdownMenuSeparator />}
        {showLayerGroupsDropdown && (
          <>
            <DropdownMenuLabel>{layerGroupsLabel}</DropdownMenuLabel>
            {layerGroups.map((layerGroup) => (
              <DropdownMenuCheckboxItem
                key={layerGroup.name}
                checked={activeLayerGroups.includes(layerGroup.name)}
                disabled={layerGroup.disabled}
                onCheckedChange={(checked) => handleLayerGroupToggle(layerGroup.name, checked)}
              >
                {layerGroup.name}
              </DropdownMenuCheckboxItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
