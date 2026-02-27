import { importStudentsApi } from "@/api-calls/student/import-students-api";
import { ImportStudentsResponse } from "@/data/interface/student";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentKeys } from "./student-keys";

export function useImportStudents() {
  const queryClient = useQueryClient();

  return useMutation<ImportStudentsResponse, Error, File>({
    mutationFn: (file: File) => importStudentsApi(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
  });
}
