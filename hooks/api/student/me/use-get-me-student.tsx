import { getMeStudentApi } from "@/api-calls/student/me/get-me-student-api";
import { useQuery } from "@tanstack/react-query";
import { meStudentKeys } from "./me-student-keys";

export function useGetMeStudent() {
  return useQuery({
    queryKey: meStudentKeys.profile(),
    queryFn: getMeStudentApi,
    staleTime: 30_000,
  });
}
