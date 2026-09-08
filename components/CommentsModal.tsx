import { View, Text, Modal, TouchableOpacity, ScrollView, Image, TextInput, ActivityIndicator } from 'react-native'
import React from 'react'
import { Post } from '../types'
import { useComment } from '../hooks/useComments'
import { Feather } from '@expo/vector-icons'
import { useCurrentUser } from '../hooks/useCurrentUser'

interface CommentProps {
    selectedPost: Post | null | undefined,
    onClose: () => void
}

const CommentsModal = ({ selectedPost, onClose }: CommentProps) => {
    const { commentText, setCommentText, createComment, isCreatingComment } = useComment()
    const { currentUser } = useCurrentUser()

    const handleClose = () => {
        onClose();
        setCommentText("")
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
                <ScrollView className='flex-1'>
                    {/* original post */}
                    <View className='border-b border-gray-100 bg-white p-4' >
                        <View className='flex-1' >
                            <View className='flex-row'>
                                <Image source={{ uri: selectedPost?.user.profilePicture }} className="size-12 rounded-full mr-3" />

                                <View className='flex-row flex-1'>
                                    <View className='  mb-1'>
                                        <View className='flex-row pb-2'>
                                            <Text className='font-bold text-gray-900 mr-1'>{selectedPost.user.firstName}{selectedPost.user.lastName}</Text>
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
                        <View className='border-b border-gray-100 bg-white p-4' >
                            <View className='flex-row' >
                                <Image className='size-10 rounded-full mr-3' source={{ uri: comment.user.profilePicture }} />
                                <View className='flex-1' >
                                    <View className='flex-row items-center mb-1' >
                                        <Text>{comment.user.firstName}{comment.user.lastName}</Text>
                                        <Text className='text-gray-500 text-sm ml-1'>@{comment.user.username}</Text>
                                    </View>
                                    <Text className='text-gray-900 text-base leading-5 mb-2'>{comment.content}</Text>

                                </View>
                            </View>

                        </View>
                    ))}
                    {/* Add comment input */}
                    <View className='p-4 flex-1 border-t border-gray-100 '>
                        <View className='flex-row'>
                            <Image source={{ uri: currentUser?.profilePicture }} className='w-10 h-10 rounded-full mr-3' />

                            <View className='flex-1'>
                                <TextInput className='border border-gray-200 rounded-lg p-3 text-base mb-3'
                                    placeholder='Write a comment...'
                                    value={commentText}
                                    onChangeText={setCommentText}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical='top'

                                />
                                <TouchableOpacity className={`px-4 py-2 rounded-lg self-start ${commentText.trim() ? "bg-blue-500" : "bg-gray-300"}`} onPress={() => createComment(selectedPost?._id)}
                                    disabled={isCreatingComment || !commentText.trim()}
                                >
                                    {isCreatingComment ? (
                                        <ActivityIndicator size={"small"} color={"white"} />
                                    ) : (
                                        <Text className={`font-semibold ${commentText.trim() ? "text-white" : "text-gray-500"}`}>Reply</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </ScrollView>


            )}
        </Modal>
    )
}

export default CommentsModal