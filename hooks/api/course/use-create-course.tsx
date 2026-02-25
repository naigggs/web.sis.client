import { createCourseApi } from "@/api/course/create-course-api";
import { CreateCourseRequest } from "@/data/interface/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseKeys } from "./course-keys";

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCourseRequest) => createCourseApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}
