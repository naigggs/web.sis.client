import { unreserveMeApi } from "@/api/student/me/unreserve-me-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meStudentKeys } from "./me-student-keys";

export function useUnreserveMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: string) => unreserveMeApi(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meStudentKeys.reservations() });
      queryClient.invalidateQueries({
        queryKey: meStudentKeys.eligibleSubjects(),
      });
    },
  });
}
