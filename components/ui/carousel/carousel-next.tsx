"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { useCarousel } from "@/hooks/use-carousel"

import { Button } from "@/components/ui"

export function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <IconChevronRight />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}
