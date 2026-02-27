import { patchCourseApi } from "@/api-calls/course/patch-course-api";
import { PatchCourseRequest } from "@/data/interface/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseKeys } from "./course-keys";

interface PatchCourseVariables {
  id: string;
  payload: PatchCourseRequest;
}

export function usePatchCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: PatchCourseVariables) =>
      patchCourseApi(id, payload),
    onSuccess: (updatedCourse, { id }) => {
      queryClient.setQueryData(courseKeys.detail(id), updatedCourse);
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}
