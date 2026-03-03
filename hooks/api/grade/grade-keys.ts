import { GetGradeHistoryParams, GetGradesParams } from "@/data/interface/grade";

export const gradeKeys = {
  all: ["grades"] as const,
  lists: () => [...gradeKeys.all, "list"] as const,
  list: (params: GetGradesParams) => [...gradeKeys.lists(), params] as const,
  histories: () => [...gradeKeys.all, "history"] as const,
  history: (params: GetGradeHistoryParams) =>
    [...gradeKeys.histories(), params] as const,
  details: () => [...gradeKeys.all, "detail"] as const,
  detail: (id: string) => [...gradeKeys.details(), id] as const,
};
