"use client"

import { Combobox as ComboboxPrimitive } from "@base-ui/react"

import { cn } from "@/lib/utils"

export function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return <ComboboxPrimitive.Group data-slot="combobox-group" className={cn(className)} {...props} />
}

function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn("text-muted-foreground px-3.5 py-2.5 text-xs", className)}
      {...props}
    />
  )
}
