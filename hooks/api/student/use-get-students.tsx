import { getStudentsApi } from "@/api/student/get-students-api";
import { GetStudentsParams } from "@/data/interface/student";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { studentKeys } from "./student-keys";

export function useGetStudents(params: GetStudentsParams = {}) {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => getStudentsApi(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
