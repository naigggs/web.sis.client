import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectKeys } from "./subject-keys";
import { bulkDeleteSubjectsApi } from "@/api-calls/subject/bulk-delete-subjects-api";

export function useBulkDeleteSubjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteSubjectsApi(ids),
    onSuccess: (_, ids) => {
      ids.forEach((id) =>
        queryClient.removeQueries({ queryKey: subjectKeys.detail(id) }),
      );
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}
