import { getCourseByIdApi } from "@/api/course/get-course-by-id-api";
import { useQuery } from "@tanstack/react-query";
import { courseKeys } from "./course-keys";

export function useGetCourseById(courseId: string) {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => getCourseByIdApi(courseId),
    enabled: !!courseId,
    staleTime: 60_000,
  });
}
