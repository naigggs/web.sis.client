"use client"

import * as React from "react"
import { type ComponentType } from "react"

export function createLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  const LazyComponent = React.lazy(factory)

  return React.forwardRef<unknown, React.ComponentProps<T>>((props, ref) => {
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
      setIsMounted(true)
    }, [])

    if (!isMounted) {
      return null
    }

    return (
      <React.Suspense>
        <LazyComponent {...(props as any)} ref={ref} />
      </React.Suspense>
    )
  })
}
