import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/expo";
import { useApiClient, userApi } from "../utils/api";
import axios from "axios";

export const useUserSync = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const api = useApiClient();

  const syncUserMutation = useMutation({
    mutationFn: () => userApi.syncUser(api),
    onSuccess: (response: any) =>
      console.log("User synced successfully:", response.data.message),
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error("User sync failed:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        return;
      }

      console.error("User sync failed:", error);
    },
  });

  // auto-sync user when SignedIn
  useEffect(() => {
    // if user is signed in and user is not synced yet, sync user
    if (isSignedIn && !syncUserMutation.data) {
      syncUserMutation.mutate();
    }
  }, [isLoaded, isSignedIn, syncUserMutation.data, syncUserMutation.mutate]);

  return null;
};
