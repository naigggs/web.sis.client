"use client"

import * as React from "react"

import { AuthContext } from "@/contexts/auth-context"

export const useAuth = () => {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
