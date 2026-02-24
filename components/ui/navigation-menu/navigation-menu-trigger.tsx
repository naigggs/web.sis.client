import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"
import { IconChevronDown } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { navigationMenuTriggerStyle } from "@/components/ui/variants"

export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <IconChevronDown
        className="relative top-px ml-1 size-3 transition duration-300 group-data-open/navigation-menu-trigger:rotate-180 group-data-popup-open/navigation-menu-trigger:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}
