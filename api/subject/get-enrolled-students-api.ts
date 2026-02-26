import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { EnrolledStudentResponse } from "@/data/interface/subject";

export async function getEnrolledStudentsApi(
  subjectId: string,
): Promise<EnrolledStudentResponse[]> {
  const res = await fetch(
    `${API_URL}/v1/subjects/${subjectId}/enrolled-students`,
    { credentials: "include" },
  );
  if (!res.ok) throw new Error("Get enrolled students failed");
  const json: ApiResponse<{ students: EnrolledStudentResponse[] }> =
    await res.json();
  return json.data?.students ?? [];
}
