import { getUsersApi } from "@/api-calls/user/get-users-api";
import { GetUsersParams } from "@/data/interface/user";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { userKeys } from "./user-keys";

export function useGetUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsersApi(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
