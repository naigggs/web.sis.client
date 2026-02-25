import { getEligibleSubjectsApi } from "@/api/student/get-eligible-subjects-api";
import { useQuery } from "@tanstack/react-query";
import { studentKeys } from "./student-keys";

export function useGetEligibleSubjects(studentId: string) {
  return useQuery({
    queryKey: studentKeys.eligibleSubjects(studentId),
    queryFn: () => getEligibleSubjectsApi(studentId),
    enabled: !!studentId,
    staleTime: 30_000,
  });
}
