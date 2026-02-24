"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { useRouter, useParams } from "next/navigation"
import { IconArrowRight, IconPencil, IconTrash, IconLoader } from "@tabler/icons-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useVisualizer } from "@/hooks/use-visualizer"
import type { SelectedLot } from "@/contexts/visualizer-context"

interface MapLayerContextMenuProps {
  position: { x: number; y: number } | null
  layerData: SelectedLot | null
  onClose: () => void
}

export function MapLayerContextMenu({ position, layerData, onClose }: MapLayerContextMenuProps) {
  const router = useRouter()
  const params = useParams()
  const { setSelectedLot } = useVisualizer()
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  if (!position || !layerData) return null

  function handleMoveToBlueprint() {
    setSelectedLot(layerData)
    onClose()

    // Show compiling toast
    const promise = new Promise((resolve) => setTimeout(resolve, 1500))
    toast.promise(promise, {
      loading: "Compiling blueprint assets...",
      success: "Blueprint ready!",
      error: "Failed to compile blueprint",
    })

    setTimeout(() => {
      router.push(`/tools/visualizer/${params.name}/blueprint`)
    }, 1000)
  }

  return createPortal(
    <div
      ref={menuRef}
      className="bg-popover text-popover-foreground fixed z-9999 min-w-[180px] overflow-hidden rounded-xl border p-1 shadow-lg"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button
        onClick={handleMoveToBlueprint}
        className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
      >
        <IconArrowRight className="size-4" />
        Move to Blueprint
      </button>
      <button
        disabled
        className="text-muted-foreground flex w-full cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm opacity-50"
      >
        <IconPencil className="size-4" />
        Edit Shape
      </button>
      <button
        disabled
        className="text-muted-foreground flex w-full cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm opacity-50"
      >
        <IconTrash className="size-4" />
        Delete Lot
      </button>
    </div>,
    document.body,
  )
}
