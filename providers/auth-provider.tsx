"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { AuthContext } from "@/contexts/auth-context"
import { loginApi } from "@/api/auth/login-api"
import { logoutApi } from "@/api/auth/logout-api"
import { refreshApi } from "@/api/auth/refresh-api"
import { LoginRequest } from "@/data/interface/auth"
import { UserResponse } from "@/data/interface/user"

const SESSION_COOKIE = "auth_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function setSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

function persistUser(user: UserResponse) {
  localStorage.setItem("user", JSON.stringify(user))
}

function clearUser() {
  localStorage.removeItem("user")
}

function getStoredUser(): UserResponse | null {
  try {
    const raw = localStorage.getItem("user")
    return raw ? (JSON.parse(raw) as UserResponse) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const router = useRouter()

  const handleSignOut = React.useCallback(async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error("Logout failed", error)
    } finally {
      setUser(null)
      clearUser()
      clearSessionCookie()
      router.push("/login")
    }
  }, [router])

  const handleSignIn = async (creds: LoginRequest): Promise<boolean> => {
    const data = await loginApi(creds)
    const loggedInUser = data.data?.user
    if (!loggedInUser) throw new Error(data.message ?? "Login failed")
    setUser(loggedInUser)
    persistUser(loggedInUser)
    setSessionCookie()
    return true
  }

  const handleRefresh = React.useCallback(async (): Promise<boolean> => {
    try {
      const data = await refreshApi()
      const refreshedUser = data.data?.user
      if (!refreshedUser) throw new Error("No user in refresh response")
      setUser(refreshedUser)
      persistUser(refreshedUser)
      setSessionCookie()
      return true
    } catch (error) {
      console.error("Refresh failed", error)
      await handleSignOut()
      return false
    }
  }, [handleSignOut])

  // On mount: rehydrate from localStorage, then validate session with the server
  React.useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = getStoredUser()
        if (!stored) return
        setUser(stored)
        await handleRefresh()
      } catch (error) {
        console.error("Auth init error", error)
      } finally {
        setIsLoading(false)
      }
    }
    initAuth()
  }, [handleRefresh])

  // Global 401 interceptor — silently refreshes once, then retries
  React.useEffect(() => {
    if (typeof window === "undefined") return

    const originalFetch = window.fetch.bind(window)
    let refreshingPromise: Promise<boolean> | null = null

    window.fetch = async (...args: Parameters<typeof fetch>): Promise<Response> => {
      const url =
        typeof args[0] === "string"
          ? args[0]
          : args[0] instanceof URL
            ? args[0].href
            : (args[0] as Request).url

      // Never intercept the refresh endpoint itself, or when no session exists
      const isRefreshUrl = url.includes("/auth/refresh")
      const hasSession = !!localStorage.getItem("user")

      const res = await originalFetch(...args)

      if (res.status !== 401 || isRefreshUrl || !hasSession) return res

      if (!refreshingPromise) {
        refreshingPromise = handleRefresh().finally(() => {
          refreshingPromise = null
        })
      }

      const refreshed = await refreshingPromise
      return refreshed ? originalFetch(...args) : res
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [handleRefresh])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        refresh: handleRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


