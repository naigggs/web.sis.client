import { getReservationsApi } from "@/api-calls/student/reservation/get-reservations-api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { studentKeys } from "../student-keys";

export function useGetReservations(studentId: string) {
  return useQuery({
    queryKey: [...studentKeys.detail(studentId), "reservations"],
    queryFn: () => getReservationsApi(studentId),
    placeholderData: keepPreviousData,
    enabled: !!studentId,
    staleTime: 30_000,
  });
}
