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
  if (!res.ok) {
    let apiMessage = "Failed to add prerequisite.";
    let apiErrors: string[] = [];

    try {
      const errorJson: ApiResponse<null> = await res.json();
      apiMessage = errorJson.message || apiMessage;
      apiErrors = (errorJson.errors ?? [])
        .map((error) => error.message)
        .filter(Boolean);
    } catch {
      // Ignore parsing issues and keep fallback message.
    }

    const error = new Error(apiMessage) as Error & {
      apiMessage?: string;
      apiErrors?: string[];
    };

    error.apiMessage = apiMessage;
    error.apiErrors = apiErrors;

    throw error;
  }
  const json: ApiResponse<{ prerequisite: PrerequisiteResponse }> =
    await res.json();
  return json.data!.prerequisite;
}
