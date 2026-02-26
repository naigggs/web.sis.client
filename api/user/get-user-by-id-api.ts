import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { UserResponse } from "@/data/interface/user";

export async function getUserByIdApi(userId: string): Promise<UserResponse> {
  const res = await fetch(`${API_URL}/v1/users/${userId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get user failed");
  const json: ApiResponse<{ user: UserResponse }> = await res.json();
  return json.data!.user;
}
