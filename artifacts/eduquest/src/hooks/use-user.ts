import { useGetMe, useDailyLogin, getGetMeQueryKey } from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export function useUserQuery() {
  return useGetMe({
    request: { headers: getAuthHeaders() },
    query: {
      retry: false, // Don't retry on 401s
      staleTime: 5 * 60 * 1000,
    }
  });
}

export function useDailyLoginMutation() {
  const queryClient = useQueryClient();
  return useDailyLogin({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      }
    }
  });
}
