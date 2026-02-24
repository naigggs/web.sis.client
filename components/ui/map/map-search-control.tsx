"use client"

import { cn } from "@/lib/utils"
import { PlaceAutocomplete } from "@/components/ui"
import type { PlaceAutocompleteProps } from "@/components/ui/place-autocomplete/place-autocomplete"

import { MapControlContainer } from "./map-control-container"

export function MapSearchControl({ className, ...props }: PlaceAutocompleteProps) {
  return (
    <MapControlContainer className={cn("top-1 left-1 z-1001 w-60", className)}>
      <PlaceAutocomplete {...props} />
    </MapControlContainer>
  )
}
