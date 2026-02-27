import { unreserveSubjectApi } from "@/api-calls/student/reservation/unreserve-subject-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentKeys } from "../student-keys";

interface UnreserveSubjectVars {
  studentId: string;
  reservationId: string;
}

export function useUnreserveSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, reservationId }: UnreserveSubjectVars) =>
      unreserveSubjectApi(studentId, reservationId),
    onSuccess: (_data, { studentId }) => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.detail(studentId),
      });
    },
  });
}
