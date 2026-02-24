import { ApiResponse } from "@/data/interface/api"
import { UserResponse } from "@/data/interface/user"

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginData {
  user: UserResponse
}

export type LoginResponse = ApiResponse<LoginData>