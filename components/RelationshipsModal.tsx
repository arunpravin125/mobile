import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ActivityIndicator, Alert, FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useApiClient, userApi } from '../utils/api'
import { useCurrentUser } from '../hooks/useCurrentUser'

export type RelationshipType = 'followers' | 'following'

type RelationshipUser = {
    _id: string
    username: string
    firstName: string
    lastName: string
    profilePicture?: string
    bio?: string
    isFollowing: boolean
}

interface RelationshipsModalProps {
    isVisible: boolean
    type: RelationshipType | null
    onClose: () => void
}

const RelationshipsModal = ({ isVisible, type, onClose }: RelationshipsModalProps) => {
    const api = useApiClient()
    const queryClient = useQueryClient()
    const { currentUser } = useCurrentUser()

    const relationshipsQuery = useQuery({
        queryKey: ['relationships', type],
        queryFn: () => userApi.getRelationshipUsers(api, type as RelationshipType),
        enabled: isVisible && Boolean(type),
        select: (response) => response.data.users as RelationshipUser[],
    })

    const followMutation = useMutation({
        mutationFn: (userId: string) => userApi.toggleFollow(api, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['relationships'] })
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
        },
        onError: (error: any) => {
            Alert.alert('Error', error.response?.data?.error || 'Unable to update follow status.')
        },
    })

    const users = relationshipsQuery.data || []
    const title = type === 'following' ? 'Following' : 'Followers'

    return (
        <Modal visible={isVisible} animationType='slide' presentationStyle='pageSheet' onRequestClose={onClose}>
            <View className='flex-1 bg-white'>
                <View className='flex-row items-center justify-between border-b border-gray-100 px-4 py-3'>
                    <TouchableOpacity onPress={onClose} accessibilityLabel='Close relationships'>
                        <Feather name='x' size={24} color='#657786' />
                    </TouchableOpacity>
                    <Text className='text-lg font-bold text-gray-900'>{title}</Text>
                    <View className='w-6' />
                </View>

                {relationshipsQuery.isLoading ? (
                    <View className='flex-1 items-center justify-center'>
                        <ActivityIndicator size='large' color='#1DA1F2' />
                    </View>
                ) : relationshipsQuery.isError ? (
                    <View className='flex-1 items-center justify-center px-6'>
                        <Text className='mb-3 text-gray-500'>Unable to load {title.toLowerCase()}.</Text>
                        <TouchableOpacity onPress={() => relationshipsQuery.refetch()} className='rounded-full bg-blue-500 px-5 py-2'>
                            <Text className='font-semibold text-white'>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={users}
                        keyExtractor={(user) => user._id}
                        contentContainerStyle={{ paddingVertical: 8 }}
                        ListEmptyComponent={<Text className='p-8 text-center text-gray-500'>No {title.toLowerCase()} yet.</Text>}
                        renderItem={({ item }) => {
                            const isCurrentUser = item._id === currentUser?._id
                            const isPending = followMutation.isPending && followMutation.variables === item._id

                            return (
                                <View className='flex-row items-center px-4 py-3'>
                                    <TouchableOpacity
                                        className='mr-3 flex-1 flex-row items-center'
                                        onPress={() => {
                                            onClose()
                                            router.push({ pathname: '/profile/[username]', params: { username: item.username } })
                                        }}
                                    >
                                        <Image source={{ uri: item.profilePicture || '' }} className='mr-3 h-12 w-12 rounded-full bg-gray-100' />
                                        <View className='flex-1'>
                                            <Text className='font-semibold text-gray-900'>{item.firstName} {item.lastName}</Text>
                                            <Text className='text-sm text-gray-500'>@{item.username}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {!isCurrentUser && (
                                        <TouchableOpacity
                                            disabled={isPending}
                                            onPress={() => followMutation.mutate(item._id)}
                                            className={`min-w-24 items-center rounded-full border px-4 py-2 ${item.isFollowing ? 'border-gray-300 bg-white' : 'border-blue-500 bg-blue-500'} ${isPending ? 'opacity-50' : ''}`}
                                        >
                                            {isPending ? (
                                                <ActivityIndicator size='small' color={item.isFollowing ? '#1DA1F2' : '#FFFFFF'} />
                                            ) : (
                                                <Text className={`font-semibold ${item.isFollowing ? 'text-gray-900' : 'text-white'}`}>
                                                    {item.isFollowing ? 'Unfollow' : 'Follow'}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )
                        }}
                    />
                )}
            </View>
        </Modal>
    )
}

export default RelationshipsModal
