import { addSubjectsToCourseApi } from "@/api/course/add-subjects-to-course-api";
import { AddSubjectsToCourseRequest } from "@/data/interface/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseKeys } from "./course-keys";

interface AddSubjectsVariables {
  courseId: string;
  payload: AddSubjectsToCourseRequest;
}

export function useAddSubjectsToCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, payload }: AddSubjectsVariables) =>
      addSubjectsToCourseApi(courseId, payload),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
    },
  });
}
