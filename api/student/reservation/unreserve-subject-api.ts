import { API_URL } from "@/config/constants";

export async function unreserveSubjectApi(
  studentId: string,
  reservationId: string,
): Promise<void> {
  const res = await fetch(
    `${API_URL}/v1/students/${studentId}/reservations/${reservationId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("Unreserve subject failed");
}
