"use client"

import * as React from "react"
import { useMap } from "react-leaflet"

import { useMapDrawContext } from "./map-context"

export function MapKeyboardShortcuts() {
  const map = useMap()
  const context = useMapDrawContext()

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return
      }

      // Zoom in: + or =
      if (e.key === "+" || e.key === "=") {
        e.preventDefault()
        map.zoomIn()
        return
      }

      // Zoom out: -
      if (e.key === "-") {
        e.preventDefault()
        map.zoomOut()
        return
      }

      // Move: m
      if (e.key === "m" || e.key === "M") {
        e.preventDefault()
        if (context) {
          context.setActiveMode(context.activeMode === "move" ? null : "move")
        }
        return
      }

      // Edit: e
      if (e.key === "e" || e.key === "E") {
        e.preventDefault()
        if (context) {
          context.setActiveMode(context.activeMode === "edit" ? null : "edit")
        }
        return
      }

      // Delete: d
      if (e.key === "d" || e.key === "D") {
        e.preventDefault()
        if (context) {
          context.setActiveMode(context.activeMode === "delete" ? null : "delete")
        }
        return
      }

      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault()
        if (context) {
          const { activeMode, editControlRef, deleteControlRef, setActiveMode } = context
          if (activeMode === "edit") {
            editControlRef.current?.revertLayers()
            setActiveMode(null)
          } else if (activeMode === "delete") {
            deleteControlRef.current?.revertLayers()
            setActiveMode(null)
          }
        }
        return
      }

      // Escape: Cancel current mode
      if (e.key === "Escape") {
        e.preventDefault()
        if (context) {
          context.setActiveMode(null)
        }
        return
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [map, context])

  return null
}
