import { ApiResponse } from "@/data/interface/api";
import { UserResponse } from "@/data/interface/user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  user: UserResponse;
}

export interface MeData {
  user: UserResponse;
}

export type LogoutData = Record<string, never>;

export type LoginResponse = ApiResponse<LoginData>;
export type RefreshResponse = ApiResponse<LoginData>;
export type LogoutResponse = ApiResponse<LogoutData>;
export type MeResponse = ApiResponse<MeData>;
