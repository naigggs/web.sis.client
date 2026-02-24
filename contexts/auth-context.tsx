"use client"

import * as React from "react"

import { UserResponse } from "@/data/interface/user"
import { LoginRequest } from "@/data/interface/auth"

export type AuthContextType = {
  user: UserResponse | null
  isLoading: boolean
  signIn: (creds: LoginRequest) => Promise<boolean>
  signOut: () => Promise<void>
  refresh: () => Promise<boolean>
  verifyPhone: () => void
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined)
