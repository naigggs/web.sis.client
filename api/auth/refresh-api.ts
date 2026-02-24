import { API_URL } from "@/config/constants"
import { LoginResponse } from "@/data/interface/auth"

export async function refreshApi(): Promise<LoginResponse> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }

  const response = await fetch(`${API_URL}/v1/auth/refresh`, {
    method: "POST",
    headers,
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Refresh failed")
  }

  const data: LoginResponse = await response.json()

  return data
}
