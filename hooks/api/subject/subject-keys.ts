import { GetSubjectsParams } from "@/data/interface/subject";

export const subjectKeys = {
  all: ["subjects"] as const,
  lists: () => [...subjectKeys.all, "list"] as const,
  list: (params: GetSubjectsParams) =>
    [...subjectKeys.lists(), params] as const,
  details: () => [...subjectKeys.all, "detail"] as const,
  detail: (id: string) => [...subjectKeys.details(), id] as const,
  prerequisites: (id: string) =>
    [...subjectKeys.detail(id), "prerequisites"] as const,
  enrolledStudents: (id: string) =>
    [...subjectKeys.detail(id), "enrolled-students"] as const,
};
