import { addPrerequisiteApi } from "@/api-calls/subject/add-prerequisite-api";
import { AddPrerequisiteRequest } from "@/data/interface/subject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectKeys } from "./subject-keys";

interface AddPrerequisiteVariables {
  subjectId: string;
  payload: AddPrerequisiteRequest;
}

export function useAddPrerequisite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subjectId, payload }: AddPrerequisiteVariables) =>
      addPrerequisiteApi(subjectId, payload),
    onSuccess: (_, { subjectId }) => {
      queryClient.invalidateQueries({
        queryKey: subjectKeys.prerequisites(subjectId),
      });
    },
  });
}
