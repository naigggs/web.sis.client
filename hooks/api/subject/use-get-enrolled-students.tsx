import { getEnrolledStudentsApi } from "@/api/subject/get-enrolled-students-api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { subjectKeys } from "./subject-keys";

export function useGetEnrolledStudents(subjectId: string | undefined) {
  return useQuery({
    queryKey: subjectKeys.enrolledStudents(subjectId ?? ""),
    queryFn: () => getEnrolledStudentsApi(subjectId!),
    placeholderData: keepPreviousData,
    enabled: !!subjectId,
    staleTime: 30_000,
  });
}
