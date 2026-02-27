import { API_URL } from "@/config/constants";

export async function hardDeleteUserApi(userId: string): Promise<void> {
  const res = await fetch(`${API_URL}/v1/users/${userId}/hard-delete`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Hard delete user failed");
}
