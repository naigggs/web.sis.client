import * as React from "react"

import { cn } from "@/lib/utils"
import { IconChevronRight } from "@tabler/icons-react"

export function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <IconChevronRight />}
    </li>
  )
}
