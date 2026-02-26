import { getUserByIdApi } from "@/api/user/get-user-by-id-api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { userKeys } from "./user-keys";

export function useGetUserById(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserByIdApi(userId),
    placeholderData: keepPreviousData,
    enabled: !!userId,
    staleTime: 30_000,
  });
}
