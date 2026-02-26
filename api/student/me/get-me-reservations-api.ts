import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { ReservationResponse } from "@/data/interface/reservation";

export async function getMeReservationsApi(): Promise<ReservationResponse[]> {
  const res = await fetch(`${API_URL}/v1/students/me/reservations`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get my reservations failed");
  const json: ApiResponse<{ reservations: ReservationResponse[] }> =
    await res.json();
  return json.data?.reservations ?? [];
}
