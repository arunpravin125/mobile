import { useAuth } from '@clerk/expo'
import { Redirect, type Href } from 'expo-router'

export default function HomeScreen() {
    const { isLoaded, isSignedIn } = useAuth()
    if (!isLoaded) {
        return null
    }

    const destination: Href = isSignedIn ? ('/(tabs)' as Href) : '/(auth)/sign-in'

    return <Redirect href={destination} />
}
