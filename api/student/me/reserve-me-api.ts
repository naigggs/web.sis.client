import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { ReservationResponse } from "@/data/interface/reservation";

export async function reserveMeApi(
  subjectId: string,
): Promise<ReservationResponse> {
  const res = await fetch(`${API_URL}/v1/students/me/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ subjectId }),
  });
  if (!res.ok) throw new Error("Reserve subject failed");
  const json: ApiResponse<{ reservation: ReservationResponse }> =
    await res.json();
  return json.data!.reservation;
}
