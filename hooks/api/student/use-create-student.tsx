import { createStudentApi } from "@/api/student/create-student-api";
import { CreateStudentRequest } from "@/data/interface/student";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentKeys } from "./student-keys";

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStudentRequest) => createStudentApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
  });
}
