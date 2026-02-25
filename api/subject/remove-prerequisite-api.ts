import { API_URL } from "@/config/constants";

export async function removePrerequisiteApi(
  subjectId: string,
  prerequisiteSubjectId: string,
): Promise<void> {
  const res = await fetch(
    `${API_URL}/v1/subjects/${subjectId}/prerequisites/${prerequisiteSubjectId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("Remove prerequisite failed");
}
