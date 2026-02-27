import { getSubjectByIdApi } from "@/api-calls/subject/get-subject-by-id-api";
import { useQuery } from "@tanstack/react-query";
import { subjectKeys } from "./subject-keys";

export function useGetSubjectById(subjectId: string) {
  return useQuery({
    queryKey: subjectKeys.detail(subjectId),
    queryFn: () => getSubjectByIdApi(subjectId),
    enabled: !!subjectId,
    staleTime: 60_000,
  });
}
