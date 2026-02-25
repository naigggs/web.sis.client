import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { SubjectResponse } from "@/data/interface/subject";

export async function getSubjectByIdApi(
  subjectId: string,
): Promise<SubjectResponse> {
  const res = await fetch(`${API_URL}/v1/subjects/${subjectId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get subject failed");
  const json: ApiResponse<{ subject: SubjectResponse }> = await res.json();
  return json.data!.subject;
}
