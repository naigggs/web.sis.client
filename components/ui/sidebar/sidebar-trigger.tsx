"use client"

import * as React from "react"
import { IconLayoutSidebar } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/hooks/use-sidebar"

import { Button } from "@/components/ui"

export function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <IconLayoutSidebar />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
