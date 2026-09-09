import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { format } from "date-fns";
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import PostsList from "../../components/PostsList";
import { usePosts } from "../../hooks/usePosts";
import { useUserProfile } from "../../hooks/useUserProfile";

export default function UserProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { username } = useLocalSearchParams<{ username: string }>();
    const profileUsername = Array.isArray(username) ? username[0] : username;
    const { user, isLoading, error, refetch, toggleFollow, isFollowing, isFollowingPending } =
        useUserProfile(profileUsername || "");
    const { posts, refetch: refetchPosts } = usePosts(profileUsername);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#1DA1F2" />
            </View>
        );
    }

    if (error || !user) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
                <Text className="mb-4 text-center text-gray-500">Unable to load this profile.</Text>
                <TouchableOpacity onPress={() => refetch()} className="rounded-lg bg-blue-500 px-4 py-2">
                    <Text className="font-semibold text-white">Try again</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const refresh = async () => {
        await Promise.all([refetch(), refetchPosts()]);
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">
            <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
                    <Feather name="arrow-left" size={24} color="#14171A" />
                </TouchableOpacity>
                <View>
                    <Text className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</Text>
                    <Text className="text-sm text-gray-500">{posts.length} Posts</Text>
                </View>
            </View>

            <ScrollView
                refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} tintColor="#1DA1F2" />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
            >
                <Image
                    resizeMode="cover"
                    className="h-48 w-full"
                    source={{
                        uri:
                            user.bannerImage ||
                            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
                    }}
                />

                <View className="border-b border-gray-100 px-4 pb-4">
                    <View className="-mt-16 mb-4 flex-row items-end justify-between">
                        <Image
                            source={{ uri: user.profilePicture || "" }}
                            className="h-32 w-32 rounded-full border-4 border-white"
                        />
                        <TouchableOpacity
                            disabled={isFollowingPending}
                            onPress={toggleFollow}
                            className={`rounded-full border px-6 py-2 ${isFollowing ? "border-gray-300 bg-white" : "border-blue-500 bg-blue-500"}`}
                        >
                            {isFollowingPending ? (
                                <ActivityIndicator size="small" color={isFollowing ? "#1DA1F2" : "#fff"} />
                            ) : (
                                <Text className={`font-semibold ${isFollowing ? "text-gray-900" : "text-white"}`}>
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View className="mb-4">
                        <View className="mb-1 flex-row items-center">
                            <Text className="mr-1 text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</Text>
                            <Feather name="check-circle" size={20} color="#1DA1F2" />
                        </View>
                        <Text className="mb-2 text-gray-500">@{user.username}</Text>
                        {!!user.bio && <Text className="mb-3 text-gray-900">{user.bio}</Text>}
                        {!!user.location && (
                            <View className="mb-2 flex-row items-center">
                                <Feather name="map-pin" size={16} color="#657786" />
                                <Text className="ml-2 text-gray-500">{user.location}</Text>
                            </View>
                        )}
                        <View className="mb-3 flex-row items-center">
                            <Feather name="calendar" size={16} color="#657786" />
                            <Text className="ml-2 text-sm text-gray-500">
                                Joined {format(new Date(user.createdAt), "MMMM yyyy")}
                            </Text>
                        </View>
                        <View className="flex-row">
                            <Text className="mr-6 text-gray-900"><Text className="font-bold">{user.following?.length || 0}</Text> Following</Text>
                            <Text className="text-gray-900"><Text className="font-bold">{user.followers?.length || 0}</Text> Followers</Text>
                        </View>
                    </View>
                </View>

                <PostsList username={user.username} />
            </ScrollView>
        </SafeAreaView>
    );
}
