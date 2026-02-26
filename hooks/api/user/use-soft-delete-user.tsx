import { softDeleteUserApi } from "@/api/user/soft-delete-user-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "./user-keys";

export function useSoftDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => softDeleteUserApi(userId),
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
}
