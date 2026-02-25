import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import {
  GetStudentsData,
  GetStudentsParams,
  StudentResponse,
} from "@/data/interface/student";

export async function getStudentsApi(
  params: GetStudentsParams = {},
): Promise<GetStudentsData> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const res = await fetch(`${API_URL}/v1/students${query ? `?${query}` : ""}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get students failed");
  const json: ApiResponse<{ students: StudentResponse[] }> = await res.json();
  return {
    students: json.data?.students ?? [],
    pagination: json.pagination!,
  };
}
