"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { Separator } from "@/components/ui"

export function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border w-auto", className)}
      {...props}
    />
  )
}
