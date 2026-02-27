import { patchUserApi } from "@/api-calls/user/patch-user-api";
import { PatchUserRequest } from "@/data/interface/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "./user-keys";

interface PatchUserVars {
  userId: string;
  payload: PatchUserRequest;
}

export function usePatchUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: PatchUserVars) =>
      patchUserApi(userId, payload),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
}
