import { useLogin, useSignup, getGetMeQueryKey, type AuthRequest } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { setAuthToken, clearAuthToken } from "@/lib/utils";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useLogin({
    mutation: {
      onSuccess: (data) => {
        setAuthToken(data.token);
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      },
    },
  });
}

export function useSignupMutation() {
  const queryClient = useQueryClient();
  return useSignup({
    mutation: {
      onSuccess: (data) => {
        setAuthToken(data.token);
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      },
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    clearAuthToken();
    queryClient.clear();
    window.location.href = "/login";
  };
}
