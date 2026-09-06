import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOutButton from '../../components/SignOutButton'
import { useUserSync } from '../../hooks/useUserSync'

export default function HomeTab() {
    useUserSync()
    return (
        <SafeAreaView className="flex-1 ">
            <Text>Homescreen</Text>
            <SignOutButton />
        </SafeAreaView>
    )
}
