import { deleteCourseApi } from "@/api/course/bulk-delete-courses-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseKeys } from "./course-keys";

export function useBulkDeleteCourses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteCoursesApi(ids),
    onSuccess: (_, ids) => {
      ids.forEach((id) =>
        queryClient.removeQueries({ queryKey: courseKeys.detail(id) }),
      );
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}
