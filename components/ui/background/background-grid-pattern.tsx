import { cn } from "@/lib/utils"

interface BackgroundGridPatternProps {
  className?: string
}

export function BackgroundGridPattern({ className }: BackgroundGridPatternProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]",
        className,
      )}
    />
  )
}
