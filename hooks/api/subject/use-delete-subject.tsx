import { deleteSubjectApi } from "@/api/subject/delete-subject-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectKeys } from "./subject-keys";

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subjectId: string) => deleteSubjectApi(subjectId),
    onSuccess: (_, subjectId) => {
      queryClient.removeQueries({ queryKey: subjectKeys.detail(subjectId) });
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}
