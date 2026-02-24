"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function CommandFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="command-footer"
      className={cn(
        "bg-muted/50 text-muted-foreground -mx-1 mt-1 -mb-1 flex items-center border-t px-2 py-1.5 text-xs font-medium",
        className,
      )}
      {...props}
    />
  )
}
