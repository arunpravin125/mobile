import { View, Text, Modal, TouchableOpacity, ActivityIndicator, ScrollView, TextInput } from 'react-native'
import React from 'react'

interface EditProfileModalProps {
    isVisible: boolean,
    onClose: () => void,
    formData: {
        firstName: string,
        lastName: string,
        bio: string,
        location: string
    };
    saveProfile: () => void
    updateFormField: (fields: string, value: string) => void;
    isUpdating: boolean
}

const EditProfileModal = ({ isVisible, onClose, formData, saveProfile, updateFormField, isUpdating }: EditProfileModalProps) => {

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