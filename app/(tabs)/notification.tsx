import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNotifications } from '../../hooks/useNotifications'
import { Feather } from '@expo/vector-icons'
import NoNotificationFound from '../../components/NoNotificationFound'
import { Notification } from '../../types'
import NotificationCard from '../../components/NotificationCard'

export default function NotificationScreen() {
    const { notifications, isLoading, error, refetch, isRefetching, deleteNotification } = useNotifications()

    const inserts = useSafeAreaInsets()

    if (error) {
        console.log("NotificationScreenError:", error)
        return (
            <View className='flex-1 items-center justify-center p-8'>
                <Text className='text-gray-500 mb-4'>Failed to load notifications</Text>
                <TouchableOpacity className='bg-blue-500 px-4 py-2 rounded-lg ' onPress={() => refetch()} >
                    <Text className='text-white font-semibold' >Retry</Text>
                </TouchableOpacity>

            </View>
        )
    }

    return (
        <SafeAreaView className='flex-1 bg-white ' edges={["top"]}>
            {/* Header */}
            <View className='flex-row items-center px-4 py-2 justify-between ' >
                <Text className='text-xl font-bold text-gray-900' >Notifications</Text>
                <TouchableOpacity>
                    <Feather name='settings' size={24} color="#657786" />
                </TouchableOpacity>

            </View>
            {/* content */}
            <ScrollView refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={"#1da1f2"} />} className='flex-1 ' contentContainerStyle={{ paddingBottom: 100 + inserts.bottom }} showsVerticalScrollIndicator={false} >
                {isLoading ? (
                    <View className='flex-1 items-center justify-center p-8'>
                        <ActivityIndicator size={"large"} color={"#1da1f2"} />
                        <Text className='text-gray-500 mt-4'>Loading notifications...</Text>
                    </View>

                ) : notifications.length === 0 ? (
                    <NoNotificationFound />

                ) : (
                    notifications?.map((notification: Notification) => (
                        <NotificationCard notification={notification} onDelete={deleteNotification} key={notification?._id} />
                    ))
                )}

            </ScrollView>
        </SafeAreaView>
    )


}
