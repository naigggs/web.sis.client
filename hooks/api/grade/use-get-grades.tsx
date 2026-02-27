import { getGradesApi } from "@/api-calls/grade/get-grades-api";
import { GetGradesParams } from "@/data/interface/grade";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { gradeKeys } from "./grade-keys";

export function useGetGrades(params: GetGradesParams = {}) {
  return useQuery({
    queryKey: gradeKeys.list(params),
    queryFn: () => getGradesApi(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
