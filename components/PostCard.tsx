import { View, Text, Alert, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Post, User } from '../types'
import { AntDesign, Feather } from '@expo/vector-icons'
import { formatDate, formatNumber } from '../utils/formatters'
// import { formatDate } from 'date-fns'
// import { formatDate } from '../utils/formatters'

interface PostCardProps {
    post: Post
    onLike: (postId: string) => void,
    onDelete: (postId: string) => void,
    currentUser: User,
    isLiked?: boolean
}

const PostCard = ({ post, onLike, onDelete, currentUser, isLiked }: PostCardProps) => {

    const isOwnPost = post?.user?._id === currentUser?._id

    const handleDelete = () => {
        Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => onDelete(post._id) },
        ])
    }

    return (
        <View className='border-b border-gray-400 bg-white p-4'>

            <View className='flex-row flex-1 justify-between '>
                <View className='flex-row mr-3'>
                    <Image source={{ uri: post.user.profilePicture || "" }} className='w-12 h-12 rounded-full mr-3' />
                    <View className='flex-col'>
                        <Text className='font-bold'>{post.user.firstName + post.user.lastName}</Text>
                        <Text className='text-xs text-gray-400'>{post.user.username} . {formatDate(post.createdAt)}</Text>

                    </View>
                </View>


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
                <View className='flex-row justify-between flex-1 '>


                    <TouchableOpacity onPress={() => { }} className='flex-row gap-1 items-center'>
                        <Feather name="message-circle" size={18} color={"#657786"} />
                        <Text>{formatNumber(post.comments?.length || 0)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }} className='flex-row gap-1 items-center'>
                        <Feather name="repeat" size={18} color={"#657786"} />
                        <Text>0</Text>
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

        </View>
    )
}

export default PostCard