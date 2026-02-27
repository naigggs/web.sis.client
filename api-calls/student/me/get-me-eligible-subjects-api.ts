import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { SubjectStatusResponse } from "@/data/interface/subject";

export async function getMeEligibleSubjectsApi(): Promise<
  SubjectStatusResponse[]
> {
  const res = await fetch(`${API_URL}/v1/students/me/eligible-subjects`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get my eligible subjects failed");
  const json: ApiResponse<{ subjects: SubjectStatusResponse[] }> =
    await res.json();
  return json.data?.subjects ?? [];
}
