import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import {
  CourseResponse,
  GetCoursesData,
  GetCoursesParams,
} from "@/data/interface/course";

export async function getCoursesApi(
  params: GetCoursesParams = {},
): Promise<GetCoursesData> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const res = await fetch(`${API_URL}/v1/courses${query ? `?${query}` : ""}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get courses failed");
  const json: ApiResponse<{ courses: CourseResponse[] }> = await res.json();
  return {
    courses: json.data?.courses ?? [],
    pagination: json.pagination ?? undefined,
  };
}
