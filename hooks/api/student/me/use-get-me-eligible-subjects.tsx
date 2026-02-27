import { getMeEligibleSubjectsApi } from "@/api-calls/student/me/get-me-eligible-subjects-api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { meStudentKeys } from "./me-student-keys";

export function useGetMeEligibleSubjects() {
  return useQuery({
    queryKey: meStudentKeys.eligibleSubjects(),
    queryFn: getMeEligibleSubjectsApi,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
