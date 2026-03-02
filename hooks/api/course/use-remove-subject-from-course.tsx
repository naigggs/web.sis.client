import { removeSubjectFromCourseApi } from "@/api-calls/course/remove-subject-from-course-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseKeys } from "./course-keys";

interface RemoveSubjectVariables {
  courseId: string;
  subjectId: string;
}

export function useRemoveSubjectFromCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, subjectId }: RemoveSubjectVariables) =>
      removeSubjectFromCourseApi(courseId, subjectId),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
    },
  });
}
