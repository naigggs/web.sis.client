import { getStudentByIdApi } from "@/api/student/get-student-by-id-api";
import { useQuery } from "@tanstack/react-query";
import { studentKeys } from "./student-keys";

export function useGetStudentById(studentId: string) {
  return useQuery({
    queryKey: studentKeys.detail(studentId),
    queryFn: () => getStudentByIdApi(studentId),
    enabled: !!studentId,
    staleTime: 60_000,
  });
}
