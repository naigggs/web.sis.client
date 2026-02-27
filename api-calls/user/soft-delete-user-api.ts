import { API_URL } from "@/config/constants";

export async function softDeleteUserApi(userId: string): Promise<void> {
  const res = await fetch(`${API_URL}/v1/users/${userId}/soft-delete`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Soft delete user failed");
}
