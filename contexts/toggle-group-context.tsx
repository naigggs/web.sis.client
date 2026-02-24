"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { toggleVariants } from "@/components/ui/variants"

export const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }
>({
  size: "default",
  variant: "default",
  spacing: 0,
  orientation: "horizontal",
})
