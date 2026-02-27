import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import {
  GetReservationsData,
  ReservationResponse,
} from "@/data/interface/reservation";

export async function getReservationsApi(
  studentId: string,
): Promise<GetReservationsData> {
  const res = await fetch(`${API_URL}/v1/students/${studentId}/reservations`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get reservations failed");
  const json: ApiResponse<{ reservations: ReservationResponse[] }> =
    await res.json();
  return {
    reservations: json.data?.reservations ?? [],
  };
}
