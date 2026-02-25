import { getPrerequisitesApi } from "@/api/subject/get-prerequisites-api";
import { useQuery } from "@tanstack/react-query";
import { subjectKeys } from "./subject-keys";

export function useGetPrerequisites(subjectId: string) {
  return useQuery({
    queryKey: subjectKeys.prerequisites(subjectId),
    queryFn: () => getPrerequisitesApi(subjectId),
    enabled: !!subjectId,
    staleTime: 60_000,
  });
}
