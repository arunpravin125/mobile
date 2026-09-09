import { Feather } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Image, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useApiClient, userApi } from '../../utils/api'

const TRENDING_TOPICS = [{ topic: "#ReactNative", tweets: "125k" },
{ topic: "#TypeScript", tweets: "89k" },
{ topic: "#WebDevelopment", tweets: "234k" },
{ topic: "#AI", tweets: "56k" },
{ topic: "#React", tweets: "99k" },
{ topic: "#WebDevelopment", tweets: "234k" },
{ topic: "#AI", tweets: "56k" },
{ topic: "#React", tweets: "99k" },
{ topic: "#WebDevelopment", tweets: "234k" },
{ topic: "#AI", tweets: "56k" },
{ topic: "#React", tweets: "99k" },
{ topic: "#WebDevelopment", tweets: "234k" },
{ topic: "#AI", tweets: "56k" },
{ topic: "#React", tweets: "99k" },
{ topic: "#WebDevelopment", tweets: "234k" },
{ topic: "#AI", tweets: "56k" },
{ topic: "#React", tweets: "99k" },
{ topic: "#WebDevelopment", tweets: "234k" },
{ topic: "#AI", tweets: "56k" },
{ topic: "#React", tweets: "99k" }
]

export default function SearchScreen() {
    const router = useRouter()
    const api = useApiClient()
    const [query, setQuery] = useState('')
    const trimmedQuery = query.trim()
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['userSearch', trimmedQuery],
        queryFn: () => userApi.searchUsers(api, trimmedQuery),
        enabled: trimmedQuery.length > 0,
        select: (response) => response.data.users,
    })

    const openProfile = (username: string) => {
        Keyboard.dismiss()
        router.push({ pathname: '/profile/[username]', params: { username } })
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* header */}
            <View className='px-3 py-4 flex-1 gap-2 border-gray-100'>
                <View className='flex-row items-center  bg-gray-100 rounded-full px-4 py-3' >
                    <Feather name='search' size={20} color={"#657786"} />
                    <TextInput
                        placeholder='Search Twitter'
                        className='ml-3 flex-1 text-base'
                        placeholderTextColor={'#657786'}
                        value={query}
                        onChangeText={setQuery}
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                </View>
                <View className=' border border-gray-200 w-full' />
                {trimmedQuery ? (
                    <ScrollView className='flex-1'>
                        {isLoading ? (
                            <ActivityIndicator className='mt-8' size='small' color='#1DA1F2' />
                        ) : users.length > 0 ? (
                            users.map((user: any) => (
                                <TouchableOpacity
                                    key={user._id}
                                    onPress={() => openProfile(user.username)}
                                    className='flex-row items-center border-b border-gray-100 px-4 py-3'
                                >
                                    <Image source={{ uri: user.profilePicture || '' }} className='mr-3 h-12 w-12 rounded-full bg-gray-100' />
                                    <View className='flex-1'>
                                        <Text className='font-semibold text-gray-900'>{user.firstName} {user.lastName}</Text>
                                        <Text className='text-sm text-gray-500'>@{user.username}</Text>
                                        {!!user.bio && <Text numberOfLines={1} className='text-sm text-gray-500'>{user.bio}</Text>}
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text className='p-8 text-center text-gray-500'>No users found</Text>
                        )}
                    </ScrollView>
                ) : (
                    <ScrollView className='flex-1'>
                        <View className='p-4' >
                            <Text className='text-xl font-bold text-gray-900 mb-4' >Trending for you</Text>
                            {TRENDING_TOPICS?.map((item, index) => (
                                <TouchableOpacity key={index} className='py-3 border-b border-gray-100' >
                                    <Text className='text-gray-500 text-sm'>Trending in Technology</Text>
                                    <Text className='font-bold text-gray-900 text-lg'>{item.topic}</Text>
                                    <Text className='text-gray-500 text-sm'>{item.tweets} Tweets</Text>

                                </TouchableOpacity>
                            ))}

                        </View>

                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    )
}
