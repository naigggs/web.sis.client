import { patchSubjectApi } from "@/api/subject/patch-subject-api";
import { PatchSubjectRequest } from "@/data/interface/subject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectKeys } from "./subject-keys";

interface PatchSubjectVariables {
  id: string;
  payload: PatchSubjectRequest;
}

export function usePatchSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: PatchSubjectVariables) =>
      patchSubjectApi(id, payload),
    onSuccess: (updatedSubject, { id }) => {
      queryClient.setQueryData(subjectKeys.detail(id), updatedSubject);
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}
