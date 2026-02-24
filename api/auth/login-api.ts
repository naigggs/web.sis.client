import { LoginRequest, LoginResponse } from "@/data/interface/auth"
import { API_URL } from "@/config/constants"

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email: credentials.email, password: credentials.password }),
  })

  if (!response.ok) {
    throw new Error("Login failed")
  }

  const data: LoginResponse = await response.json()
  return data
}
