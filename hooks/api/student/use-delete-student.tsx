import { deleteStudentApi } from "@/api/student/delete-student-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentKeys } from "./student-keys";

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId: string) => deleteStudentApi(studentId),
    onSuccess: (_, studentId) => {
      // Remove the individual student from cache
      queryClient.removeQueries({ queryKey: studentKeys.detail(studentId) });
      // Invalidate all list caches to remove the deleted record
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
  });
}
