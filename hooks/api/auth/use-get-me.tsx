import { meApi } from "@/api-calls/auth/me-api";
import { useQuery } from "@tanstack/react-query";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useGetMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: meApi,
    staleTime: 60_000,
  });
}
