import { View, Text, Modal, TouchableOpacity, ScrollView, Image, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { Post } from '../types'
import { useComment } from '../hooks/useComments'
import { Feather } from '@expo/vector-icons'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface CommentProps {
    selectedPost: Post | null | undefined,
    onClose: () => void
}

const CommentsModal = ({ selectedPost, onClose }: CommentProps) => {
    const { commentText, setCommentText, createComment, isCreatingComment, updateComment, deleteComment, isUpdatingComment, isDeletingComment } = useComment()
    const { currentUser } = useCurrentUser()
    const insets = useSafeAreaInsets()
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
    const [editingText, setEditingText] = useState('')

    const handleClose = () => {
        onClose();
        setCommentText("")
        setEditingCommentId(null)
    }

    const handleDelete = (commentId: string) => {
        Alert.alert('Delete comment', 'Are you sure you want to delete this comment?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteComment(commentId) },
        ])
    }

    return (
        <Modal visible={!!selectedPost} animationType='slide' presentationStyle='pageSheet'>
            {/* Modal header */}
            <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100' >

                <TouchableOpacity className='' onPress={handleClose}>
                    {/* <Feather name='arrow-left' color={"blue"} size={20} /> */}
                    <Text className='text-blue-500 text-xl'>Close</Text>

                </TouchableOpacity>
                <Text className='text-xl font-semibold'>Comments</Text>
                <View className='w-12' />


            </View>

            {selectedPost && (
                <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: 16 }}>
                        {/* original post */}
                        <View className='border-b border-gray-100 bg-white p-4' >
                            <View className='flex-1' >
                                <View className='flex-row'>
                                    <TouchableOpacity onPress={() => router.push({ pathname: '/profile/[username]', params: { username: selectedPost.user.username } })}>
                                        <Image source={{ uri: selectedPost?.user.profilePicture }} className="size-12 rounded-full mr-3" />
                                    </TouchableOpacity>

                                    <View className='flex-row flex-1'>
                                        <View className='  mb-1'>
                                            <View className='flex-row pb-2'>
                                                <TouchableOpacity onPress={() => router.push({ pathname: '/profile/[username]', params: { username: selectedPost.user.username } })}>
                                                    <Text className='font-bold text-gray-900 mr-1'>{selectedPost.user.firstName}{selectedPost.user.lastName}</Text>
                                                </TouchableOpacity>
                                                <Text className='text-gray-500'>@{selectedPost.user.username}</Text>
                                            </View>

                                            <View className='flex-1' >
                                                {selectedPost.content && (
                                                    <Text className='text-gray-900 text-base leading-5 mb-3'>{selectedPost.content}</Text>
                                                )}

                                                {selectedPost.image && (
                                                    <Image source={{ uri: selectedPost.image }} className='h-48 border border-gray-300 w-full rounded-2xl mb-3' resizeMode='cover' />
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>

                            </View>

                        </View>
                        {/* comments list */}
                        {selectedPost.comments.map(comment => (
                            <View key={comment._id} className='border-b border-gray-100 bg-white p-4' >
                                <View className='flex-row' >
                                    <TouchableOpacity onPress={() => router.push({ pathname: '/profile/[username]', params: { username: comment.user.username } })}>
                                        <Image className='size-10 rounded-full mr-3' source={{ uri: comment.user.profilePicture }} />
                                    </TouchableOpacity>
                                    <View className='flex-1' >
                                        <View className='flex-row items-center mb-1' >
                                            <TouchableOpacity onPress={() => router.push({ pathname: '/profile/[username]', params: { username: comment.user.username } })}>
                                                <Text>{comment.user.firstName}{comment.user.lastName}</Text>
                                            </TouchableOpacity>
                                            <Text className='text-gray-500 text-sm ml-1'>@{comment.user.username}</Text>
                                        </View>
                                        {editingCommentId === comment._id ? (
                                            <View className='rounded-xl border border-blue-100 bg-blue-50 p-3'>
                                                <TextInput
                                                    value={editingText}
                                                    onChangeText={setEditingText}
                                                    multiline
                                                    maxLength={280}
                                                    placeholder='Edit your comment...'
                                                    textAlignVertical='top'
                                                    className='mb-3 min-h-[84px] rounded-lg border border-gray-200 bg-white p-3 text-base text-gray-900'
                                                />
                                                <View className='flex-row items-center justify-between'>
                                                    <Text className='text-xs text-gray-400'>{editingText.length}/280</Text>
                                                    <View className='flex-row items-center gap-3'>
                                                        <TouchableOpacity
                                                            className='rounded-full border border-gray-300 bg-white px-4 py-2'
                                                            onPress={() => { setEditingCommentId(null); setEditingText('') }}
                                                        >
                                                            <Text className='font-medium text-gray-600'>Cancel</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            className={`rounded-full px-5 py-2 ${editingText.trim() ? 'bg-blue-500' : 'bg-gray-300'}`}
                                                            disabled={isUpdatingComment || !editingText.trim()}
                                                            onPress={() => { updateComment(comment._id, editingText.trim()); setEditingCommentId(null); setEditingText('') }}
                                                        >
                                                            <Text className='font-semibold text-white'>Save</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        ) : (
                                            <View className='flex-row items-start justify-between'>
                                                <Text className='mr-3 flex-1 text-gray-900 text-base leading-5 mb-2'>{comment.content}</Text>
                                                {currentUser?._id === comment.user._id && (
                                                    <View className='flex-row gap-3'>
                                                        <TouchableOpacity onPress={() => { setEditingCommentId(comment._id); setEditingText(comment.content) }}>
                                                            <Feather name='edit-2' size={16} color='#657786' />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity disabled={isDeletingComment} onPress={() => handleDelete(comment._id)}>
                                                            <Feather name='trash-2' size={16} color='#E0245E' />
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                            </View>
                                        )}

                                    </View>
                                </View>

                            </View>
                        ))}
                    </ScrollView>
                    <View className='border-t border-gray-200 bg-white px-4 pt-3' style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
                        <View className='flex-row items-end'>
                            <Image source={{ uri: currentUser?.profilePicture }} className='mr-3 h-9 w-9 rounded-full' />
                            <View className='flex-1 flex-row items-end'>
                                <TextInput
                                    className='mr-2 min-h-[44px] flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-base'
                                    placeholder='Write a comment...'
                                    value={commentText}
                                    onChangeText={setCommentText}
                                    multiline
                                    maxLength={280}
                                    numberOfLines={2}
                                    textAlignVertical='top'
                                />
                                <TouchableOpacity
                                    className={`h-11 min-w-[68px] items-center justify-center rounded-full px-3 ${commentText.trim() ? "bg-blue-500" : "bg-gray-200"}`}
                                    onPress={() => createComment(selectedPost._id)}
                                    disabled={isCreatingComment || !commentText.trim()}
                                >
                                    {isCreatingComment ? (
                                        <ActivityIndicator size='small' color='white' />
                                    ) : (
                                        <Text className={`font-semibold ${commentText.trim() ? "text-white" : "text-gray-400"}`}>Reply</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>

            )}
        </Modal>
    )
}

export default CommentsModal