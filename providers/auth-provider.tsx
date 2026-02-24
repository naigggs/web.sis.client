"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/contexts/auth-context"
import { loginApi } from "@/api/auth/login-api"
import { logoutApi } from "@/api/auth/logout-api"
import { refreshApi } from "@/api/auth/refresh-api"
import { LoginRequest } from "@/data/interface/auth"
import { UserResponse } from "@/data/interface/user"

/** One-year max-age; SameSite=Lax so it's sent on top-level navigations. */
const SESSION_COOKIE = "auth_session"
const PHONE_VERIFIED_COOKIE = "phone_verified"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function setSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

function setPhoneVerifiedCookie() {
  document.cookie = `${PHONE_VERIFIED_COOKIE}=1; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

function clearPhoneVerifiedCookie() {
  document.cookie = `${PHONE_VERIFIED_COOKIE}=; path=/; max-age=0; SameSite=Lax`
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
      localStorage.removeItem("user")
      clearSessionCookie()
      clearPhoneVerifiedCookie()
      router.push("/login")
    }
  }, [router])

  const handleSignIn = async (creds: LoginRequest, remember?: boolean) => {
    try {
      const data = await loginApi(creds)
      setUser(data.data.user)
      localStorage.setItem("user", JSON.stringify(data.data.user))
      setSessionCookie()
      if (data.data.user.isPhoneVerified) setPhoneVerifiedCookie()
      else clearPhoneVerifiedCookie()
      return true
    } catch (error) {
      console.error("Login failed", error)
      throw error
    }
  }

  const handleRefresh = React.useCallback(async () => {
    try {
      const data = await refreshApi()
      setUser(data.data.user)
      localStorage.setItem("user", JSON.stringify(data.data.user))
      setSessionCookie()
      if (data.data.user.isPhoneVerified) setPhoneVerifiedCookie()
      else clearPhoneVerifiedCookie()
      return true
    } catch (error) {
      console.error("Refresh failed", error)
      await handleSignOut()
      return false
    }
  }, [handleSignOut])

  React.useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          try {
            const data = await refreshApi()
            setUser(data.data.user)
            localStorage.setItem("user", JSON.stringify(data.data.user))
          } catch (error) {
            console.error("Session validation failed", error)
            await handleSignOut()
          }
        }
      } catch (error) {
        console.error("Auth initialization error", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [handleSignOut])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const originalFetch = window.fetch.bind(window)
    let refreshingPromise: Promise<boolean> | null = null

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      try {
        let res = await originalFetch(...args)

        if (res.status !== 401) return res

        if (!refreshingPromise) {
          refreshingPromise = (async () => {
            try {
              const ok = await handleRefresh()
              return !!ok
            } catch (e) {
              return false
            } finally {
              refreshingPromise = null
            }
          })()
        }

        const refreshed = await refreshingPromise
        if (!refreshed) {
          return res
        }
        return await originalFetch(...args)
      } catch (err) {
        return originalFetch(...args)
      }
    }

    return () => {
      try {
        window.fetch = originalFetch
      } catch (e) {}
    }
  }, [handleRefresh])

  const handleVerifyPhone = React.useCallback(() => {
    setPhoneVerifiedCookie()
    setUser((prev) => (prev ? { ...prev, isPhoneVerified: true } : prev))
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        localStorage.setItem("user", JSON.stringify({ ...parsed, isPhoneVerified: true }))
      } catch {}
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        refresh: handleRefresh,
        verifyPhone: handleVerifyPhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
