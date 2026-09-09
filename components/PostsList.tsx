import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { ProfileTimeline, usePosts } from '../hooks/usePosts'
import { Post } from '../types'
import PostCard from './PostCard'
import CommentsModal from './CommentsModal'
import { useRepost } from '../hooks/useRepost'

const PostsList = ({ username, timeline = 'posts' }: { username?: string; timeline?: ProfileTimeline }) => {
    const { currentUser, } = useCurrentUser()
    const { posts, isLoading, error, refetch, toggleLike, deletePost, checkIsLiked } = usePosts(username, timeline)
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
    const { repost } = useRepost()
    const selectedPost = selectedPostId ? posts.find((p: Post) => p._id === selectedPostId) : null
    console.log("currentUser:", currentUser)
    console.log("posts", posts)

    if (isLoading) {
        return (
            <View className='p-8 items-center'>
                <ActivityIndicator size={"large"} color="#1DA1F2" />
                <Text className='text-gray-500 mt-2'>Loading Posts...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View>
                <Text>Failed to load posts</Text>
                <TouchableOpacity onPress={() => refetch()} className='bg-blue-500 px-4 py-2 rounded-lg'>
                    <Text className='text-white font-semibold' >Retry</Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (posts.length === 0) {
        return (
            <View className='p-8 items-center' >
                <Text className='text-gray-500'>No posts yet</Text>
            </View>
        )
    }

    return (
        <>
            {posts.map((post: Post) => {
                const isReposted = posts.some((candidate: Post) =>
                    candidate.user?._id === currentUser?._id &&
                    candidate.repostedPost?._id === post._id
                )

                return <PostCard key={post._id} post={post} onLike={toggleLike} onDelete={deletePost} onRepost={repost} currentUser={currentUser}
                    isLiked={checkIsLiked(post.likes, currentUser)}
                    isReposted={isReposted}
                    onComment={setSelectedPostId}

                />
            })}
            <CommentsModal selectedPost={selectedPost} onClose={() => setSelectedPostId(null)} />
        </>
    )
}

export default PostsList