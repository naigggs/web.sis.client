import { patchReservationApi } from "@/api-calls/student/reservation/patch-reservation-api";
import { PatchReservationRequest } from "@/data/interface/reservation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentKeys } from "../student-keys";

interface PatchReservationVars {
  studentId: string;
  reservationId: string;
  payload: PatchReservationRequest;
}

export function usePatchReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, reservationId, payload }: PatchReservationVars) =>
      patchReservationApi(studentId, reservationId, payload),
    onSuccess: (_data, { studentId }) => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.detail(studentId),
      });
    },
  });
}
