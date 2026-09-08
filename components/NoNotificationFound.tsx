import { View, Text } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'

const NoNotificationFound = () => {
    return (
        <View className='flex-1 items-center justify-center px-8' style={{ minHeight: 400 }}>
            <View className='items-center'>
                <Feather name='bell' size={80} color="#e1e8ed" />
                <Text className='text-2xl font-semibold text-gray-500 mt-6 mb-3'>No notifications yet</Text>
                <Text className='text-gray-700 px-1'>When people like, comment, or follow you, you&apos; see it here</Text>
            </View>
        </View>
    )
}

export default NoNotificationFound