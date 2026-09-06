import { Redirect, Tabs } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '@clerk/expo'

export default function TabsLayout() {
    const insets = useSafeAreaInsets()

    const { isLoaded, isSignedIn } = useAuth()

    if (!isLoaded) return null

    if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />


    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: "#1DA1F2",

            tabBarInactiveTintColor: "#657786",
            tabBarStyle: {
                backgroundColor: "#fff",
                borderTopWidth: 1,
                borderTopColor: "#E1E8ED",
                height: 50 + insets.bottom,
                paddingTop: 8
            },
            headerShown: false
        }}>
            <Tabs.Screen name="index" options={{ title: '', tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} /> }} />

            <Tabs.Screen name="search" options={{ title: '', tabBarIcon: ({ color, size }) => <Feather name="search" color={color} size={size} /> }} />
            <Tabs.Screen name="notification" options={{ title: '', tabBarIcon: ({ color, size }) => <Feather name="bell" color={color} size={size} /> }} />
            <Tabs.Screen name="messages" options={{ title: '', tabBarIcon: ({ color, size }) => <Feather name="mail" color={color} size={size} /> }} />
            <Tabs.Screen name="profile" options={{ title: '', tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} /> }} />
        </Tabs>
    )
}
