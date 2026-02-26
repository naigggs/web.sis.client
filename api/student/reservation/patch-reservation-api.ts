import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import {
  PatchReservationRequest,
  ReservationResponse,
} from "@/data/interface/reservation";

export async function patchReservationApi(
  studentId: string,
  reservationId: string,
  payload: PatchReservationRequest,
): Promise<ReservationResponse> {
  const res = await fetch(
    `${API_URL}/v1/students/${studentId}/reservations/${reservationId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) throw new Error("Update reservation failed");
  const json: ApiResponse<{ reservation: ReservationResponse }> =
    await res.json();
  return json.data!.reservation;
}
