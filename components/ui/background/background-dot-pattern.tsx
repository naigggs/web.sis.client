import { cn } from "@/lib/utils"

interface BackgroundDotPatternProps {
  className?: string
}

export function BackgroundDotPattern({ className }: BackgroundDotPatternProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]",
        className,
      )}
    />
  )
}
