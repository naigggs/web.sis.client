import { API_URL } from "@/config/constants";

export async function unreserveMeApi(reservationId: string): Promise<void> {
  const res = await fetch(
    `${API_URL}/v1/students/me/reservations/${reservationId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("Cancel reservation failed");
}
