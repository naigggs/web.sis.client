import { getMeReservationsApi } from "@/api-calls/student/me/get-me-reservations-api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { meStudentKeys } from "./me-student-keys";

export function useGetMeReservations() {
  return useQuery({
    queryKey: meStudentKeys.reservations(),
    queryFn: getMeReservationsApi,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
