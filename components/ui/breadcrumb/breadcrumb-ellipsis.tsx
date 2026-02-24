import * as React from "react"

import { cn } from "@/lib/utils"
import { IconDots } from "@tabler/icons-react"

export function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-5 items-center justify-center [&>svg]:size-4", className)}
      {...props}
    >
      <IconDots />
      <span className="sr-only">More</span>
    </span>
  )
}
