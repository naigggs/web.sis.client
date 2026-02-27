import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { PrerequisiteResponse } from "@/data/interface/subject";

export async function getPrerequisitesApi(
  subjectId: string,
): Promise<PrerequisiteResponse[]> {
  const res = await fetch(`${API_URL}/v1/subjects/${subjectId}/prerequisites`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get prerequisites failed");
  const json: ApiResponse<{ prerequisites: PrerequisiteResponse[] }> =
    await res.json();
  return json.data?.prerequisites ?? [];
}
