import { useGetRecommendations } from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/utils";

export function useRecommendationsQuery() {
  return useGetRecommendations({
    request: { headers: getAuthHeaders() },
  });
}
