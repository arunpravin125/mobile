import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { Stack } from 'expo-router'
import '../global.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StatusBar } from 'expo-status-bar'
import { ThemeProvider, useTheme } from '../context/ThemeContext'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

function AppNavigator() {
  const { theme } = useTheme()

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
  )
}
// import { Stack } from "expo-router";
// import { ClerkProvider } from '@clerk/expo'
// import { tokenCache } from '@clerk/expo/token-cache'
// import { Slot } from 'expo-router'

// const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

// if (!publishableKey) {
//   throw new Error('Add your Clerk Publishable Key to the .env file')
// }
// import "../global.css"

// export default function RootLayout() {
//   return
//   <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>

//     {/* <Stack /> */}
//   </ClerkProvider>


// }
