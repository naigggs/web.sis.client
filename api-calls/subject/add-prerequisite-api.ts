import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import {
  AddPrerequisiteRequest,
  PrerequisiteResponse,
} from "@/data/interface/subject";

export async function addPrerequisiteApi(
  subjectId: string,
  payload: AddPrerequisiteRequest,
): Promise<PrerequisiteResponse> {
  const res = await fetch(`${API_URL}/v1/subjects/${subjectId}/prerequisites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Add prerequisite failed");
  const json: ApiResponse<{ prerequisite: PrerequisiteResponse }> =
    await res.json();
  return json.data!.prerequisite;
}
