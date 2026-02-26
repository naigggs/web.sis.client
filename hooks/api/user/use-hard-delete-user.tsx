import { hardDeleteUserApi } from "@/api/user/hard-delete-user-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "./user-keys";

export function useHardDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => hardDeleteUserApi(userId),
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
}
