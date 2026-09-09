import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useApiClient, commentApi } from "../utils/api";

export const useComment = () => {
  const [commentText, setCommentText] = useState("");
  const api = useApiClient();

  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: string;
      content: string;
    }) => {
      await commentApi.createComment(api, postId, content);
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries();
    },
    onError: () => {
      Alert.alert("Error", "Failed to post comment. Try again");
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => commentApi.updateComment(api, commentId, content),
    onSuccess: () => queryClient.invalidateQueries(),
    onError: () => Alert.alert("Error", "Failed to update comment. Try again"),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentApi.deleteComment(api, commentId),
    onSuccess: () => queryClient.invalidateQueries(),
    onError: () => Alert.alert("Error", "Failed to delete comment. Try again"),
  });

  const createComment = (postId: string) => {
    if (!commentText.trim()) {
      Alert.alert("Empty Comment", "Plsease write something before posting!");
      return;
    }

    createCommentMutation.mutate({ postId, content: commentText.trim() });
  };

  return {
    commentText,
    setCommentText,
    createCommentMutation,
    createComment,
    isCreatingComment: createCommentMutation.isPending,
    updateComment: (commentId: string, content: string) =>
      updateCommentMutation.mutate({ commentId, content }),
    deleteComment: (commentId: string) =>
      deleteCommentMutation.mutate(commentId),
    isUpdatingComment: updateCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
  };
};
