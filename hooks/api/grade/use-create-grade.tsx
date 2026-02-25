import { createGradeApi } from "@/api/grade/create-grade-api";
import { CreateGradeRequest } from "@/data/interface/grade";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gradeKeys } from "./grade-keys";

export function useCreateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGradeRequest) => createGradeApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeKeys.lists() });
    },
  });
}
