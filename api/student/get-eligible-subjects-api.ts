import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { SubjectStatusResponse } from "@/data/interface/subject";

export async function getEligibleSubjectsApi(
  studentId: string,
): Promise<SubjectStatusResponse[]> {
  const res = await fetch(
    `${API_URL}/v1/students/${studentId}/eligible-subjects`,
    {
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("Get eligible subjects failed");
  const json: ApiResponse<{ subjects: SubjectStatusResponse[] }> =
    await res.json();
  return json.data!.subjects;
}
