import { patchStudentApi } from "@/api-calls/student/patch-student-api";
import { PatchStudentRequest } from "@/data/interface/student";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentKeys } from "./student-keys";

interface PatchStudentVariables {
  id: string;
  payload: PatchStudentRequest;
}

export function usePatchStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: PatchStudentVariables) =>
      patchStudentApi(id, payload),
    onSuccess: (updatedStudent, { id }) => {
      // Update the individual student cache immediately
      queryClient.setQueryData(studentKeys.detail(id), updatedStudent);
      // Invalidate all list caches to reflect the updated record
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
  });
}
