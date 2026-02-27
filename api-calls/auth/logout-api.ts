import { LogoutResponse } from "@/data/interface/auth"
import { API_URL } from "@/config/constants"

export async function logoutApi(): Promise<LogoutResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  const response = await fetch(`${API_URL}/v1/auth/logout`, {
    method: "POST",
    headers,
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Logout failed")
  }

  const data: LogoutResponse = await response.json()
  return data
}
