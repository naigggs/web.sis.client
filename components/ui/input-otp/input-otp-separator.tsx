"use client"

import * as React from "react"

import { IconMinus } from "@tabler/icons-react"

export function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <IconMinus />
    </div>
  )
}
