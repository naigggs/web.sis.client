import { createSubjectApi } from "@/api/subject/create-subject-api";
import { CreateSubjectRequest } from "@/data/interface/subject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectKeys } from "./subject-keys";

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubjectRequest) => createSubjectApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}
