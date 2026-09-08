import { RefreshControl, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOutButton from '../../components/SignOutButton'
import { useUserSync } from '../../hooks/useUserSync'
import { Feather, Ionicons } from '@expo/vector-icons'
import PostComponents from '../../components/PostComponents'
import PostsList from '../../components/PostsList'
import { useState } from 'react'
import { set } from 'date-fns'
import { usePosts } from '../../hooks/usePosts'

export default function HomeTab() {
    const [isRefetching, setIsRefetching] = useState(false)
    const { refetch: refetchPosts } = usePosts()

    const handlePullToRefresh = async () => {
        setIsRefetching(true)

        await refetchPosts()
        setIsRefetching(false)
    }


    useUserSync()
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className='flex-row justify-between items-center px-4 py-3 border-b border-gray-100' >
                <Ionicons name='logo-x' color={"black"} className=' fill-[#04E1F3]' size={23} />
                <Text className='text-base font-extrabold' >Home</Text>

                <SignOutButton />
            </View>
            <ScrollView refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handlePullToRefresh} tintColor={"#1da1f2"} />} showsVerticalScrollIndicator={false} className='flex-1' contentContainerStyle={{ paddingBottom: 80 }} >
                <PostComponents />
                <PostsList />
            </ScrollView>
        </SafeAreaView>
    )
}
