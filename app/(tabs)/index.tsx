import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOutButton from '../../components/SignOutButton'
import { useUserSync } from '../../hooks/useUserSync'
import { Feather, Ionicons } from '@expo/vector-icons'
import PostComponents from '../../components/PostComponents'

export default function HomeTab() {
    useUserSync()
    return (
        <SafeAreaView className="flex-1 ">
            <View className='flex-row justify-between items-center px-4 py-3 border-b border-gray-100' >
                <Ionicons name='logo-x' color={"black"} className=' fill-[#04E1F3]' size={20} />
                <Text className='text-base font-extrabold' >Home</Text>

                <SignOutButton />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} className='flex-1' contentContainerStyle={{ paddingBottom: 80 }} >
                <PostComponents />

            </ScrollView>
        </SafeAreaView>
    )
}
