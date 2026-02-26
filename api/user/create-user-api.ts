import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { CreateUserRequest, UserResponse } from "@/data/interface/user";

export async function createUserApi(
  payload: CreateUserRequest,
): Promise<UserResponse> {
  const res = await fetch(`${API_URL}/v1/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Create user failed");
  const json: ApiResponse<{ user: UserResponse }> = await res.json();
  return json.data!.user;
}
