import { deleteCourseApi } from "@/api/course/delete-course-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseKeys } from "./course-keys";

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => deleteCourseApi(courseId),
    onSuccess: (_, courseId) => {
      queryClient.removeQueries({ queryKey: courseKeys.detail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}
