import { getSubjectsApi } from "@/api/subject/get-subjects-api";
import { GetSubjectsParams } from "@/data/interface/subject";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { subjectKeys } from "./subject-keys";

export function useGetSubjects(params: GetSubjectsParams = {}) {
  return useQuery({
    queryKey: subjectKeys.list(params),
    queryFn: () => getSubjectsApi(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
