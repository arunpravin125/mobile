import { View, Text, Alert, Image, TouchableOpacity, Modal, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Post, User } from '../types'
import { AntDesign, Feather } from '@expo/vector-icons'
import { formatDate, formatNumber } from '../utils/formatters'
import { router } from 'expo-router'
// import { formatDate } from 'date-fns'
// import { formatDate } from '../utils/formatters'

interface PostCardProps {
    post: Post
    onLike: (postId: string) => void,
    onDelete: (postId: string) => void,
    currentUser: User,
    isLiked?: boolean,
    isReposted?: boolean,
    onComment: (postId: string) => void,
    onRepost: (postId: string, content?: string) => void,
}

const PostCard = ({ post, onLike, onDelete, currentUser, isLiked, isReposted, onComment, onRepost }: PostCardProps) => {
    const [isQuoteModalVisible, setIsQuoteModalVisible] = useState(false)
    const [quoteText, setQuoteText] = useState('')

    const isOwnPost = post?.user?._id === currentUser?._id

    const handleDelete = () => {
        Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => onDelete(post._id) },
        ])
    }

    const handleRepost = () => {
        Alert.alert('Repost', 'Choose how you want to share this post', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Repost', onPress: () => onRepost(post._id) },
            { text: 'Quote', onPress: () => setIsQuoteModalVisible(true) },
        ])
    }

    const submitQuote = () => {
        if (!quoteText.trim()) return
        onRepost(post._id, quoteText.trim())
        setQuoteText('')
        setIsQuoteModalVisible(false)
    }

    return (
        <View className='border-b border-gray-400 bg-white p-4'>

            {post.repostedPost && (
                <View className='mb-3 flex-row items-center'>
                    <Feather name='repeat' size={14} color='#657786' />
                    <Text className='ml-2 text-xs text-gray-500'>Reposted</Text>
                </View>
            )}

            <View className='flex-row flex-1 justify-between '>
                <TouchableOpacity className='flex-row mr-3' onPress={() => {
                    if (post.user._id === currentUser?._id) {
                        router.push('/(tabs)/profile')
                    } else {
                        router.push({ pathname: '/profile/[username]', params: { username: post.user.username } })
                    }
                }}>
                    <Image source={{ uri: post.user.profilePicture || "" }} className='w-12 h-12 rounded-full mr-3' />
                    <View className='flex-col'>
                        <Text className='font-bold'>{post.user.firstName + post.user.lastName}</Text>
                        <Text className='text-xs text-gray-400'>{post.user.username} . {formatDate(post.createdAt)}</Text>

                    </View>
                </TouchableOpacity>


                {isOwnPost &&
                    <TouchableOpacity onPress={handleDelete}>
                        <Feather name="trash-2" size={20} color={'red'} />
                    </TouchableOpacity>
                }

            </View>
            <View className='px-6 flex-1'>
                {post.content && <View className='flex-1 px-1 py-1' >
                    <Text className='text-gray-900 text-base leading-5 mb-3'>{post.content}</Text>

                </View>}
                {post.image && <View className='flex-1  py-2   rounded-3xl'>
                    <Image source={{ uri: post.image }} alt='failed to load' className='h-48 border border-gray-200 w-full rounded-2xl mb-2' />

                </View>}
                {post.repostedPost && (
                    <View className='mb-3 rounded-xl border border-gray-200 p-3'>
                        <Text className='mb-1 font-semibold text-gray-900'>
                            {post.repostedPost.user.firstName} {post.repostedPost.user.lastName}
                        </Text>
                        <Text className='mb-2 text-xs text-gray-500'>@{post.repostedPost.user.username}</Text>
                        {!!post.repostedPost.content && <Text className='text-gray-900'>{post.repostedPost.content}</Text>}
                        {!!post.repostedPost.image && <Image source={{ uri: post.repostedPost.image }} className='mt-2 h-40 w-full rounded-lg' resizeMode='cover' />}
                    </View>
                )}
                <View className='flex-row justify-between flex-1 '>


                    <TouchableOpacity onPress={() => onComment(post?._id)} className='flex-row gap-1 items-center'>
                        <Feather name="message-circle" size={18} color={"#657786"} />
                        <Text>{formatNumber(post.comments?.length || 0)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRepost} className='flex-row gap-1 items-center'>
                        <Feather name="repeat" size={18} color={isReposted ? "#17BF63" : "#657786"} />
                        <Text className={isReposted ? 'text-[#17BF63]' : undefined}>{formatNumber(post.repostCount || 0)}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-row gap-1 items-center' onPress={() => onLike(post._id)}>

                        {isLiked ? <AntDesign name="heart" size={18} color={"#E0245E"} /> : <Feather name="heart" size={20} color={"#657786"} />}
                        <Text>{formatNumber(post.likes.length) || 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }} className='flex-row items-center'>
                        <Feather name="share" size={18} color={"#657786"} />

                    </TouchableOpacity>

                </View>
            </View>

            <Modal visible={isQuoteModalVisible} transparent animationType='slide' onRequestClose={() => setIsQuoteModalVisible(false)}>
                <View className='flex-1 justify-end bg-black/40'>
                    <View className='rounded-t-2xl bg-white p-5'>
                        <View className='mb-4 flex-row items-center justify-between'>
                            <Text className='text-lg font-bold text-gray-900'>Quote post</Text>
                            <TouchableOpacity onPress={() => setIsQuoteModalVisible(false)}>
                                <Feather name='x' size={22} color='#657786' />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            value={quoteText}
                            onChangeText={setQuoteText}
                            placeholder='Add a comment...'
                            multiline
                            maxLength={280}
                            textAlignVertical='top'
                            className='mb-3 min-h-[100px] rounded-xl border border-gray-200 p-3 text-base'
                        />
                        <View className='flex-row items-center justify-between'>
                            <Text className='text-xs text-gray-400'>{quoteText.length}/280</Text>
                            <TouchableOpacity onPress={submitQuote} disabled={!quoteText.trim()} className={`rounded-full px-5 py-2 ${quoteText.trim() ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                <Text className='font-semibold text-white'>Quote</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

export default PostCard