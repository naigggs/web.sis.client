import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import {
  GetUsersData,
  GetUsersParams,
  UserResponse,
} from "@/data/interface/user";

export async function getUsersApi(
  params: GetUsersParams = {},
): Promise<GetUsersData> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const res = await fetch(`${API_URL}/v1/users${query ? `?${query}` : ""}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get users failed");
  const json: ApiResponse<{ users: UserResponse[] }> = await res.json();
  return {
    users: json.data?.users ?? [],
    pagination: json.pagination!,
  };
}
