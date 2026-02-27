import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { PatchSubjectRequest, SubjectResponse } from "@/data/interface/subject";

export async function patchSubjectApi(
  subjectId: string,
  payload: PatchSubjectRequest,
): Promise<SubjectResponse> {
  const res = await fetch(`${API_URL}/v1/subjects/${subjectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Update subject failed");
  const json: ApiResponse<{ subject: SubjectResponse }> = await res.json();
  return json.data!.subject;
}
