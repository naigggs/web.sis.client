"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive flex items-center rounded-4xl has-aria-invalid:ring-[3px]",
        className,
      )}
      {...props}
    />
  )
}
