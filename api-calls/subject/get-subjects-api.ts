import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import {
  GetSubjectsData,
  GetSubjectsParams,
  SubjectResponse,
} from "@/data/interface/subject";

export async function getSubjectsApi(
  params: GetSubjectsParams = {},
): Promise<GetSubjectsData> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  const course = params.course ?? params.courseId;
  if (course) searchParams.set("course", course);

  const query = searchParams.toString();
  const res = await fetch(`${API_URL}/v1/subjects${query ? `?${query}` : ""}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get subjects failed");
  const json: ApiResponse<{ subjects: SubjectResponse[] }> = await res.json();
  return {
    subjects: json.data?.subjects ?? [],
    pagination: json.pagination!,
  };
}
