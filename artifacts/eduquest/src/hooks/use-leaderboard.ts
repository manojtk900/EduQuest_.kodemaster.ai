import { useGetLeaderboard } from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/utils";

export function useLeaderboardQuery() {
  return useGetLeaderboard({
    request: { headers: getAuthHeaders() },
  });
}
