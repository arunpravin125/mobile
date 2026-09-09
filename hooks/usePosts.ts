import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, postApi } from "../utils/api";
import { Post } from "../types";

export type ProfileTimeline = "posts" | "replies" | "reposts";

export const usePosts = (
  username?: string,
  timeline: ProfileTimeline = "posts",
) => {
  const api = useApiClient();

  const queryClient = useQueryClient();

  const {
    data: postData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: username ? ["userPosts", username, timeline] : ["posts"],
    queryFn: () =>
      !username
        ? postApi.getPosts(api)
        : timeline === "replies"
          ? postApi.getUserReplies(api, username)
          : timeline === "reposts"
            ? postApi.getUserReposts(api, username)
            : postApi.getUserPosts(api, username),
    select: (response) => {
      const posts: Post[] = response.data.posts || [];
      const repostCounts = posts.reduce(
        (counts: Record<string, number>, post: Post) => {
          const repostedPostId = post.repostedPost?._id;

          if (repostedPostId) {
            counts[repostedPostId] = (counts[repostedPostId] || 0) + 1;
          }

          return counts;
        },
        {},
      );

      return posts.map((post) => ({
        ...post,
        repostCount: post.repostCount ?? repostCounts[post._id] ?? 0,
      }));
    },
  });

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.likePost(api, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      if (username) {
        queryClient.invalidateQueries({ queryKey: ["userPosts", username] });
      }
    },
  });
  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.deletePost(api, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (username) {
        queryClient.invalidateQueries({ queryKey: ["userPosts", username] });
      }
    },
  });

  const checkIsLiked = (postLikes: string[], currentUser: any) => {
    const isLiked = currentUser && postLikes.includes(currentUser?._id);

    return isLiked;
  };

  return {
    checkIsLiked,
    deletePost: (postId: string) => deletePostMutation.mutate(postId),
    toggleLike: (postId: string) => likePostMutation.mutate(postId),
    isLoading,
    error,
    refetch,
    posts: postData || [],
  };
};
