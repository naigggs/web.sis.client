"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function KbdKey({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex min-h-7.5 w-7.5 items-center justify-center rounded-md border border-gray-200 bg-white px-1.5 py-1 font-mono text-sm text-gray-800 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.08)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)]",
        className,
      )}
      {...props}
    />
  )
}
