import { getCoursesApi } from "@/api/course/get-courses-api";
import { GetCoursesParams } from "@/data/interface/course";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { courseKeys } from "./course-keys";

export function useGetCourses(params: GetCoursesParams = {}) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => getCoursesApi(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
