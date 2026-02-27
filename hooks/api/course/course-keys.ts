import { GetCoursesParams } from "@/data/interface/course";

export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (params: GetCoursesParams) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  subjects: (id: string) => [...courseKeys.detail(id), "subjects"] as const,
};
