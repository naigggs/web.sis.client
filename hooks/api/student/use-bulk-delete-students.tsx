import { bulkDeleteStudentsApi } from "@/api/student/bulk-delete-students-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentKeys } from "./student-keys";

export function useBulkDeleteStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteStudentsApi(ids),
    onSuccess: (_, ids) => {
      ids.forEach((id) =>
        queryClient.removeQueries({ queryKey: studentKeys.detail(id) }),
      );
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
  });
}
