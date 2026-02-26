import { createUserApi } from "@/api/user/create-user-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "./user-keys";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
