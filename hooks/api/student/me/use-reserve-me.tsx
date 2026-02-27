import { reserveMeApi } from "@/api-calls/student/me/reserve-me-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meStudentKeys } from "./me-student-keys";

export function useReserveMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subjectId: string) => reserveMeApi(subjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meStudentKeys.reservations() });
      queryClient.invalidateQueries({
        queryKey: meStudentKeys.eligibleSubjects(),
      });
    },
  });
}
