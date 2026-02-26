import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { PatchUserRequest, UserResponse } from "@/data/interface/user";

export async function patchUserApi(
  userId: string,
  payload: PatchUserRequest,
): Promise<UserResponse> {
  const res = await fetch(`${API_URL}/v1/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Update user failed");
  const json: ApiResponse<{ user: UserResponse }> = await res.json();
  return json.data!.user;
}
