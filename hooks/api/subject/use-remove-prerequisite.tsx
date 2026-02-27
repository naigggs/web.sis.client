import { removePrerequisiteApi } from "@/api-calls/subject/remove-prerequisite-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectKeys } from "./subject-keys";

interface RemovePrerequisiteVariables {
  subjectId: string;
  prerequisiteSubjectId: string;
}

export function useRemovePrerequisite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subjectId,
      prerequisiteSubjectId,
    }: RemovePrerequisiteVariables) =>
      removePrerequisiteApi(subjectId, prerequisiteSubjectId),
    onSuccess: (_, { subjectId }) => {
      queryClient.invalidateQueries({
        queryKey: subjectKeys.prerequisites(subjectId),
      });
    },
  });
}
