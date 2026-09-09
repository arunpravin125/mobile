import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import SignOutButton from '../../components/SignOutButton'
import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import { ProfileTimeline, usePosts } from '../../hooks/usePosts'
import PostsList from '../../components/PostsList'
import { useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import EditProfileModal from '../../components/EditProfileModal'
import RelationshipsModal, { RelationshipType } from '../../components/RelationshipsModal'
import SettingsModal from '../../components/SettingsModal'
import { useTheme } from '../../context/ThemeContext'

const TIMELINES: { key: ProfileTimeline; label: string }[] = [
    { key: 'posts', label: 'Posts' },
    { key: 'replies', label: 'Replies' },
    { key: 'reposts', label: 'Reposts' },
]

export default function ProfileScreen() {
    const { currentUser, isLoading, refetch: refetchProfile } = useCurrentUser()
    const insets = useSafeAreaInsets()
    const [timeline, setTimeline] = useState<ProfileTimeline>('posts')
    const [relationshipType, setRelationshipType] = useState<RelationshipType | null>(null)
    const [isSettingsVisible, setIsSettingsVisible] = useState(false)
    const { theme } = useTheme()
    const { posts: userPosts, refetch: refetchPosts, isLoading: isPostsLoading } = usePosts(currentUser?.username, timeline)
    const { isEditModalVisible, openEditModal, closeEditModal, formData, saveProfile, updateFormField, isUpdating } = useProfile()

    if (isLoading || !currentUser) {
        return <View className='flex-1 items-center justify-center bg-white dark:bg-gray-950'><ActivityIndicator size='large' color='#1DA1F2' /></View>
    }

    const refresh = async () => {
        await Promise.all([refetchProfile(), refetchPosts()])
    }

    return (
        <SafeAreaView edges={['top']} className='flex-1 bg-white dark:bg-gray-950'>
            <ScrollView
                stickyHeaderIndices={[2]}
                refreshControl={<RefreshControl refreshing={isPostsLoading} onRefresh={refresh} tintColor='#1DA1F2' />}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
            >
                <View className='flex-row items-center justify-between border-b border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950'>
                    <View>
                        <Text className='text-xl font-bold text-gray-900 dark:text-white'>{currentUser.firstName} {currentUser.lastName}</Text>
                        <Text className='text-sm text-gray-500 dark:text-gray-400'>{userPosts.length} Posts</Text>
                    </View>
                    <View className='flex-row items-center gap-4'>
                        <TouchableOpacity onPress={() => setIsSettingsVisible(true)} accessibilityLabel='Open settings'>
                            <Feather name='settings' size={22} color={theme === 'dark' ? '#E5E7EB' : '#657786'} />
                        </TouchableOpacity>
                        <SignOutButton />
                    </View>
                </View>

                <View>
                    <Image resizeMode='cover' className='h-48 w-full' source={{ uri: currentUser.bannerImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop' }} />
                    <View className='border-b border-gray-100 bg-white px-4 pb-4 dark:border-gray-800 dark:bg-gray-950'>
                        <View className='-mt-16 mb-4 flex-row items-end justify-between'>
                            <Image source={{ uri: currentUser.profilePicture || '' }} className='h-32 w-32 rounded-full border-4 border-white' />
                            <TouchableOpacity onPress={openEditModal} className='rounded-full border border-gray-300 px-6 py-2 dark:border-gray-700'>
                                <Text className='font-semibold text-gray-900 dark:text-white'>Edit profile</Text>
                            </TouchableOpacity>
                        </View>
                        <View className='mb-4'>
                            <View className='mb-1 flex-row items-center'>
                                <Text className='mr-1 text-xl font-bold text-gray-900 dark:text-white'>{currentUser.firstName} {currentUser.lastName}</Text>
                                <Feather name='check-circle' size={20} color='#1DA1F2' />
                            </View>
                            <Text className='mb-2 text-gray-500'>@{currentUser.username}</Text>
                            {!!currentUser.bio && <Text className='mb-3 text-gray-900 dark:text-gray-100'>{currentUser.bio}</Text>}
                            {!!currentUser.location && <View className='mb-2 flex-row items-center'><Feather name='map-pin' size={16} color='#657786' /><Text className='ml-2 text-gray-500'>{currentUser.location}</Text></View>}
                            <View className='mb-3 flex-row items-center'><Feather name='calendar' size={16} color='#657786' /><Text className='ml-2 text-sm text-gray-500'>Joined {format(new Date(currentUser.createdAt), 'MMMM yyyy')}</Text></View>
                            <View className='flex-row'>
                                <TouchableOpacity onPress={() => setRelationshipType('following')} className='mr-6'>
                                    <Text className='text-gray-900'><Text className='font-bold'>{currentUser.following?.length || 0}</Text> Following</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setRelationshipType('followers')}>
                                    <Text className='text-gray-900'><Text className='font-bold'>{currentUser.followers?.length || 0}</Text> Followers</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View className='flex-row border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950'>
                    {TIMELINES.map((item) => (
                        <TouchableOpacity key={item.key} onPress={() => setTimeline(item.key)} className='flex-1 items-center pt-3'>
                            <Text className={`pb-3 font-semibold ${timeline === item.key ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>{item.label}</Text>
                            <View className={`h-1 w-16 rounded-full ${timeline === item.key ? 'bg-blue-500' : 'bg-transparent'}`} />
                        </TouchableOpacity>
                    ))}
                </View>

                <PostsList username={currentUser.username} timeline={timeline} />
            </ScrollView>
            <EditProfileModal isVisible={isEditModalVisible} onClose={closeEditModal} formData={formData} saveProfile={saveProfile} updateFormField={updateFormField} isUpdating={isUpdating} />
            <RelationshipsModal isVisible={Boolean(relationshipType)} type={relationshipType} onClose={() => setRelationshipType(null)} />
            <SettingsModal isVisible={isSettingsVisible} onClose={() => setIsSettingsVisible(false)} />
        </SafeAreaView>
    )
}
