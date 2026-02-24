"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { IconChevronUp } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

export function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <IconChevronUp />
    </SelectPrimitive.ScrollUpButton>
  )
}
