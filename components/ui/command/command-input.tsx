"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { IconSearch } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

import { InputGroup, InputGroupAddon } from "@/components/ui"

export function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="p-1 pb-0">
      <InputGroup className="bg-input/30 h-9">
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        <InputGroupAddon>
          <IconSearch className="size-4 shrink-0 opacity-50" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
