export const SIDEBAR_COOKIE_NAME = "sidebar_state"
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const SIDEBAR_WIDTH = "16rem"
export const SIDEBAR_WIDTH_MOBILE = "18rem"
export const SIDEBAR_WIDTH_ICON = "3rem"
export const SIDEBAR_KEYBOARD_SHORTCUT = "b"

export const FURNITURE_SIZES: Record<string, { width: number; height: number; label: string }> = {
  chair: { width: 0.000009, height: 0.000009, label: "Chair" },
  bed: { width: 0.000018, height: 0.000027, label: "Bed" },
  bathtub: { width: 0.000015, height: 0.000009, label: "Bathtub" },
  diningTable: { width: 0.000018, height: 0.000009, label: "Dining Table" },
  sofa: { width: 0.000018, height: 0.000009, label: "Sofa" },
  sofaSingle: { width: 0.000009, height: 0.000009, label: "Single Sofa" },
  table: { width: 0.000009, height: 0.000009, label: "Table" },
  toilet: { width: 0.000005, height: 0.000007, label: "Toilet" },
  sink: { width: 0.000006, height: 0.000005, label: "Sink" },
  wardrobe: { width: 0.000014, height: 0.000006, label: "Wardrobe" },
  cabinet: { width: 0.000009, height: 0.000005, label: "Cabinet" },
  door: { width: 0.000009, height: 0.000002, label: "Door" },
}
