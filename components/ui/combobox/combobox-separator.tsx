"use client"

import { Combobox as ComboboxPrimitive } from "@base-ui/react"

import { cn } from "@/lib/utils"

export function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("bg-border/50 -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}
