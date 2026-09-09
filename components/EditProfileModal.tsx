import { View, Text, Modal, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Image, Alert } from 'react-native'
import React from 'react'
import * as ImagePicker from 'expo-image-picker'

interface EditProfileModalProps {
    isVisible: boolean,
    onClose: () => void,
    formData: {
        firstName: string,
        lastName: string,
        bio: string,
        location: string,
        profilePicture: string,
        bannerImage: string,
    };
    saveProfile: () => void
    updateFormField: (fields: string, value: string) => void;
    isUpdating: boolean
}

const EditProfileModal = ({ isVisible, onClose, formData, saveProfile, updateFormField, isUpdating }: EditProfileModalProps) => {

    const pickImage = async (field: 'profilePicture' | 'bannerImage') => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (permission.status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow photo library access to choose an image.')
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: field === 'bannerImage' ? [16, 9] : [1, 1],
            quality: 0.8,
        })

        if (!result.canceled) updateFormField(field, result.assets[0].uri)
    }

    const handleSave = () => {
        saveProfile()
        onClose()
    }
    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
            <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>

                <TouchableOpacity className='' onPress={onClose}>
                    <Text className='text-blue-500 text-lg' >Cancel</Text>
                </TouchableOpacity>
                <Text className='font-semibold text-lg'>Edit Profile</Text>
                <TouchableOpacity disabled={isUpdating} className={`${isUpdating ? "opacity-50" : ""}`} onPress={handleSave} >
                    {isUpdating ? (
                        <ActivityIndicator size={"small"} color={"#1da1f2"} />
                    ) : (
                        <Text className='text-blue-500 text-lg font-semibold'>Save</Text>
                    )}
                </TouchableOpacity>

            </View>
            <ScrollView className='flex-1 px-4 py-6'>
                <View className='space-y-4'>
                    <View>
                        <Text className='text-gray-500 text-sm mb-2'>Profile photo</Text>
                        <TouchableOpacity onPress={() => pickImage('profilePicture')} className='items-center'>
                            <Image source={{ uri: formData.profilePicture }} className='w-24 h-24 rounded-full' />
                            <Text className='text-blue-500 mt-2'>Change profile photo</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text className='text-gray-500 text-sm mb-2'>Profile banner</Text>
                        <TouchableOpacity onPress={() => pickImage('bannerImage')}>
                            <Image source={{ uri: formData.bannerImage }} className='w-full h-32 rounded-lg' resizeMode='cover' />
                            <Text className='text-blue-500 mt-2'>Change banner image</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text className='text-gray-500 text-sm mb-2'>First Name</Text>
                        <TextInput placeholder='Your first name' value={formData.firstName} onChangeText={(text) => updateFormField("firstName", text)} className='border border-gray-200 rounded-lg p-3 text-base' />
                    </View>
                    <View>
                        <Text className='text-gray-500 text-sm mb-2'>Last Name</Text>
                        <TextInput placeholder='Your first name' value={formData.lastName} onChangeText={(text) => updateFormField("lastName", text)} className='border border-gray-200 rounded-lg p-3 text-base' />
                    </View>
                    <View>
                        <Text className='text-gray-500 text-sm mb-2'>Bio</Text>
                        <TextInput placeholder='Your first name' value={formData.bio} onChangeText={(text) => updateFormField("bio", text)} className='border border-gray-200 rounded-lg p-3 text-base' />
                    </View>
                    <View>
                        <Text className='text-gray-500 text-sm mb-2'>Location</Text>
                        <TextInput placeholder='Your first name' value={formData.location} onChangeText={(text) => updateFormField("location", text)} className='border border-gray-200 rounded-lg p-3 text-base' />
                    </View>
                </View>
            </ScrollView>
        </Modal>
    )
}

export default EditProfileModal