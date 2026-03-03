import { getGradeHistoryApi } from "@/api-calls/grade/get-grade-history-api";
import { GetGradeHistoryParams } from "@/data/interface/grade";
import { useQuery } from "@tanstack/react-query";
import { gradeKeys } from "./grade-keys";

export function useGetGradeHistory(
  params: GetGradeHistoryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: gradeKeys.history(params),
    queryFn: () => getGradeHistoryApi(params),
    staleTime: 30_000,
    enabled: options?.enabled ?? true,
  });
}
