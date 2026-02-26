import { Pagination } from "./api";

export interface UserResponse {
  id: string;
  email: string;
  role: "student" | "staff" | "admin";
  isActive: boolean;
  isBlocked: boolean;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetUsersData {
  users: UserResponse[];
  pagination: Pagination;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  confirmPassword: string;
  role?: "student" | "staff" | "admin";
}

export interface PatchUserRequest {
  email?: string;
  password?: string;
  role?: "student" | "staff" | "admin";
  isActive?: boolean;
  isBlocked?: boolean;
  isSuspended?: boolean;
}
