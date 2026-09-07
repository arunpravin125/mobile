import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, postApi } from "../utils/api";

export const usePosts = () => {
  const api = useApiClient();

  const queryClient = useQueryClient();

  const {
    data: postData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postApi.getPosts(api),
    select: (response) => response.data.posts,
  });

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.likePost(api, postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.deletePost(api, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
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
