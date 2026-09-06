import { useAuth } from '@clerk/expo'
import { Redirect } from 'expo-router'

export default function SsoCallback() {
    const { isLoaded, isSignedIn } = useAuth()

    if (isLoaded && isSignedIn) {
        return <Redirect href="/(tabs)" />
    }

    return null
}
