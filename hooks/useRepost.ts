import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useApiClient, postApi } from "../utils/api";

export const useRepost = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const repostMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content?: string }) =>
      postApi.repostPost(api, postId, content || ""),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      Alert.alert("Success", variables.content ? "Quote posted" : "Reposted");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to repost. Try again";
      Alert.alert("Repost failed", message);
    },
  });

  return {
    repost: (postId: string, content?: string) =>
      repostMutation.mutate({ postId, content }),
    isReposting: repostMutation.isPending,
  };
};
