import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'
import { useSocialAuth } from '../../hooks/useSocialAuth'

export default function SignInScreen() {
    const { handleSocialAuth, isLoading } = useSocialAuth()

    return (
        <View className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center px-8">
                <View className="flex-1 justify-center">
                    <View className="items-center">
                        <Image
                            className="size-96"
                            resizeMode="contain"
                            source={require('../../assets/images/auth2.png')}
                        />
                    </View>

                    <TouchableOpacity
                        className="flex-row items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3"
                        disabled={isLoading}
                        onPress={() => handleSocialAuth('oauth_google')}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="black" size="small" />
                        ) : (
                            <>
                                <Image
                                    className="mr-3 size-10"
                                    resizeMode="contain"
                                    source={require('../../assets/images/google.png')}
                                />
                                <Text className="text-base font-medium text-black">
                                    Continue with Google
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}