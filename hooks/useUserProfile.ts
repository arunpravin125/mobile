import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";
import { useCurrentUser } from "./useCurrentUser";

export const useUserProfile = (username: string) => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  const profileQuery = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => userApi.getProfile(api, username),
    enabled: Boolean(username),
    select: (response) => response.data.user,
  });

  const followMutation = useMutation({
    mutationFn: (userId: string) => userApi.toggleFollow(api, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return {
    ...profileQuery,
    user: profileQuery.data,
    toggleFollow: () => {
      if (profileQuery.data?._id) {
        followMutation.mutate(profileQuery.data._id);
      }
    },
    isFollowing: Boolean(
      currentUser?._id &&
      profileQuery.data?.followers?.some(
        (follower: string | { _id: string }) =>
          (typeof follower === "string" ? follower : follower._id) ===
          currentUser._id,
      ),
    ),
    isFollowingPending: followMutation.isPending,
  };
};
