import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import {
  CreateSubjectRequest,
  SubjectResponse,
} from "@/data/interface/subject";

export async function createSubjectApi(
  payload: CreateSubjectRequest,
): Promise<SubjectResponse> {
  const res = await fetch(`${API_URL}/v1/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Create subject failed");
  const json: ApiResponse<{ subject: SubjectResponse }> = await res.json();
  return json.data!.subject;
}
