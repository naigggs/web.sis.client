import { patchGradeApi } from "@/api/grade/patch-grade-api";
import { PatchGradeRequest } from "@/data/interface/grade";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gradeKeys } from "./grade-keys";

interface PatchGradeVariables {
  id: string;
  payload: PatchGradeRequest;
}

export function usePatchGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: PatchGradeVariables) =>
      patchGradeApi(id, payload),
    onSuccess: (updatedGrade, { id }) => {
      queryClient.setQueryData(gradeKeys.detail(id), updatedGrade);
      queryClient.invalidateQueries({ queryKey: gradeKeys.lists() });
    },
  });
}
