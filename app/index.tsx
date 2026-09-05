import { useAuth, useClerk } from '@clerk/expo'
import { Redirect } from 'expo-router'
import { Button, Text, View } from 'react-native'

export default function HomeScreen() {
    const { isLoaded, isSignedIn } = useAuth()
    const { signOut } = useClerk()

    if (!isLoaded) {
        return null
    }

    if (!isSignedIn) {
        return <Redirect href="/(auth)" />
    }

    return (
        <View className="flex-1 items-center justify-center">
            <Text>HomeScreen</Text>
            <Button onPress={() => signOut()} title="logout" ></Button>
        </View>
    )
}
