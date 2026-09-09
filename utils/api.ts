import { useAuth, useOAuth } from "@clerk/expo";
import axios, { AxiosInstance } from "axios";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://twitter-03-09-2026.vercel.app/api";

export const createApiClient = (
  getToken: () => Promise<string | null>,
): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    let token: string | null = null;

    try {
      token = await getToken();
    } catch {
      // Public requests can continue without a Clerk token.
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  //   api return
  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  searchUsers: (api: AxiosInstance, query: string) =>
    api.get(`/users/search?q=${encodeURIComponent(query)}`),
  getRelationshipUsers: (api: AxiosInstance, type: "followers" | "following") =>
    api.get(`/users/relationships/${type}`),
  getProfile: (api: AxiosInstance, username: string) =>
    api.post(`/users/profile/${encodeURIComponent(username)}`),
  toggleFollow: (api: AxiosInstance, userId: string) =>
    api.post(`/users/follow/${userId}`),
  updateProfile: (api: AxiosInstance, data: any) =>
    api.post("/users/profile", data),
};

export const postApi = {
  createPost: (api: AxiosInstance, data: { content: string; image?: string }) =>
    api.post("/posts", data),
  getPosts: (api: AxiosInstance) => api.get("/posts"),
  getUserPosts: (api: AxiosInstance, username: string) =>
    api.get(`/posts/user/${username}`),
  getUserReplies: (api: AxiosInstance, username: string) =>
    api.get(`/posts/user/${username}/replies`),
  getUserReposts: (api: AxiosInstance, username: string) =>
    api.get(`/posts/user/${username}/reposts`),
  likePost: (api: AxiosInstance, postId: string) =>
    api.post(`/posts/${postId}/like`),
  repostPost: (api: AxiosInstance, postId: string, content = "") =>
    api.post(`/posts/${postId}/repost`, { content }),
  deletePost: (api: AxiosInstance, postId: string) =>
    api.delete(`/posts/${postId}`),
};

export const commentApi = {
  createComment: (api: AxiosInstance, postId: string, content: string) =>
    api.post(`/comments/post/${postId}`, { content }),
  updateComment: (api: AxiosInstance, commentId: string, content: string) =>
    api.patch(`/comments/${commentId}`, { content }),
  deleteComment: (api: AxiosInstance, commentId: string) =>
    api.delete(`/comments/${commentId}`),
};
