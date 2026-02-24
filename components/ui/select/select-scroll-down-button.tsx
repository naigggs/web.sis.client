"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { IconChevronDown } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

export function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <IconChevronDown />
    </SelectPrimitive.ScrollDownButton>
  )
}
