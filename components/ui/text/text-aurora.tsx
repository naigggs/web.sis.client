"use client"

import { cn } from "@/lib/utils"

interface TextAuroraProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
  colors?: string[]
  speed?: number
}

export function TextAurora({
  children,
  className,
  colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
  speed = 1,
  ...props
}: TextAuroraProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animationDuration: `${10 / speed}s`,
  }

  return (
    <span className={cn("relative inline-block", className)} {...props}>
      <span className="sr-only">{children}</span>
      <span
        className="animate-aurora relative bg-size-[200%_auto] bg-clip-text text-transparent"
        style={gradientStyle}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  )
}
