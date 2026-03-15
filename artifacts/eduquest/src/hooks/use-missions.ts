import { useGetMissions, useCompleteMission, getGetMissionsQueryKey, getGetMeQueryKey } from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export function useMissionsQuery() {
  return useGetMissions({
    request: { headers: getAuthHeaders() },
  });
}

export function useCompleteMissionMutation() {
  const queryClient = useQueryClient();
  return useCompleteMission({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMissionsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      }
    }
  });
}
