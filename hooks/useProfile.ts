import { useState } from "react";
import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";
import { useCurrentUser } from "./useCurrentUser";

export const useProfile = () => {
  const api = useApiClient();

  const queryClient = useQueryClient();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    profilePicture: "",
    bannerImage: "",
  });

  const { currentUser, refetch } = useCurrentUser();

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: any) => userApi.updateProfile(api, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update profile",
      );
    },
  });

  const openEditModal = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        profilePicture: currentUser.profilePicture || "",
        bannerImage: currentUser.bannerImage || "",
      });
    }

    setIsEditModalVisible(true);
  };

  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
  };

  const saveProfile = () => {
    const payload = new FormData();
    payload.append("firstName", formData.firstName);
    payload.append("lastName", formData.lastName);
    payload.append("bio", formData.bio);
    payload.append("location", formData.location);

    for (const field of ["profilePicture", "bannerImage"] as const) {
      const uri = formData[field];
      if (!uri || uri.startsWith("http")) continue;
      const extension = uri.split(".").pop()?.toLowerCase() || "jpg";
      payload.append(field, {
        uri,
        name: `${field}.${extension}`,
        type: extension === "png" ? "image/png" : "image/jpeg",
      } as any);
    }

    updateProfileMutation.mutate(payload);
  };

  return {
    isEditModalVisible,
    formData,
    updateFormField,
    openEditModal,
    closeEditModal,
    saveProfile,
    isUpdating: updateProfileMutation.isPending,
    refetch,
  };
};
