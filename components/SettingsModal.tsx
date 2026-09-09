import { Feather } from '@expo/vector-icons'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '../context/ThemeContext'

interface SettingsModalProps {
    isVisible: boolean
    onClose: () => void
}

const SettingsModal = ({ isVisible, onClose }: SettingsModalProps) => {
    const { theme, setTheme } = useTheme()

    return (
        <Modal visible={isVisible} animationType='slide' presentationStyle='pageSheet' onRequestClose={onClose}>
            <View className='flex-1 bg-white dark:bg-gray-950'>
                <View className='flex-row items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800'>
                    <TouchableOpacity onPress={onClose} accessibilityLabel='Close settings'>
                        <Feather name='x' size={24} color={theme === 'dark' ? '#E5E7EB' : '#657786'} />
                    </TouchableOpacity>
                    <Text className='text-lg font-bold text-gray-900 dark:text-white'>Settings</Text>
                    <View className='w-6' />
                </View>

                <View className='p-4'>
                    <Text className='mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400'>Appearance</Text>
                    <View className='overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800'>
                        {(['light', 'dark'] as const).map((option) => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => setTheme(option)}
                                className='flex-row items-center justify-between border-b border-gray-100 px-4 py-4 last:border-b-0 dark:border-gray-800'
                            >
                                <View className='flex-row items-center'>
                                    <Feather name={option === 'light' ? 'sun' : 'moon'} size={20} color={theme === option ? '#1DA1F2' : '#657786'} />
                                    <Text className='ml-3 text-base capitalize text-gray-900 dark:text-gray-100'>{option} mode</Text>
                                </View>
                                {theme === option && <Feather name='check' size={20} color='#1DA1F2' />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default SettingsModal
