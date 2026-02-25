import { reserveSubjectApi } from "@/api/student/reservation/reserve-subject-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentKeys } from "../student-keys";

interface ReserveSubjectVars {
  studentId: string;
  subjectId: string;
}

export function useReserveSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, subjectId }: ReserveSubjectVars) =>
      reserveSubjectApi(studentId, subjectId),
    onSuccess: (_data, { studentId }) => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.detail(studentId),
      });
    },
  });
}
