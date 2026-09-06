import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { CONVERSATIONS, ConversationType } from '../../data/conversation'



export default function MessageScreen() {
    const insets = useSafeAreaInsets()
    const [searchText, setSearchText] = useState("")
    const [conversationsList, setConversationsList] = useState(CONVERSATIONS)
    const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [sendingMessage, setSendingMessage] = useState(false)

    const deleteConversation = (coversationId: number) => {
        Alert.alert("Delete Conversation", "Are you sure you want delete the conversation?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive",

                onPress: () => {
                    setConversationsList((prev) => prev.filter((conv) => conv.id !== coversationId))
                }
            }
        ])
    }

    const openConversation = (conversation: ConversationType) => {
        setSelectedConversation(conversation);
        setIsChatOpen(true)
    }

    const closeChatModel = () => {
        setIsChatOpen(false)
        setSelectedConversation(null)
        setNewMessage("")
    }

    const sendMessage = () => {
        if (newMessage.trim() && selectedConversation) {
            // updated last Message in conversation
            setConversationsList((prev) => prev.map((conv) => conv.id === selectedConversation.id ? { ...conv, lastMessage: newMessage, time: "now" } : conv))
        }
        setNewMessage("")
        Alert.alert('Message Sent!', `Your message has been sent to ${selectedConversation?.user.name}`)
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
            <View className='px-1 pt-2 flex-1'>
                <View className='flex-row justify-between'>
                    <Text className='font-bold' >Messages</Text>
                    <TouchableOpacity>
                        <Feather name='edit' size={20} color={"#14637E"} />
                    </TouchableOpacity>
                </View>
                <View className='flex-1 gap-2 ' >
                    <View className='flex-row bg-gray-50 items-center rounded-full border border-gray-200 gap-2 px-4 py-3 ' >
                        <Feather name='search' size={20} color={"#A1A1A1"} />
                        <TextInput value={searchText} className='flex-1 text-base' onChangeText={setSearchText} placeholderTextColor={"#A1A1A1"} placeholder='Search for people and groups' />
                    </View>

                    <View className='border border-gray-100 ' />

                    {/* conversations */}
                    <View className='flex-1 px-0 py-3'>
                        <ScrollView className=''
                            contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
                            showsVerticalScrollIndicator={false} >
                            {conversationsList.map((conversation) => (
                                <TouchableOpacity key={conversation?.id} className='flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50'
                                    onPress={() => openConversation(conversation)}
                                    onLongPress={() => deleteConversation(conversation?.id)}
                                >
                                    <Image source={{ uri: conversation.user.avatar }} className='size-12 rounded-full mr-3 ' />
                                    <View className='flex-1 '>
                                        <View className='flex-row'>
                                            <View className='flex-1 gap-2 flex-row '>
                                                <View className='flex-row'>
                                                    <Text>{conversation.user.name}</Text>
                                                    {conversation.user.verified && (
                                                        <Feather name="check-circle" size={16} color='#1DA1F2' className='ml-1' />
                                                    )}
                                                </View>
                                                <Text className='text-gray-400 text-sm'>@{conversation.user.username}</Text>
                                            </View>
                                            <Text className='text-sm text-gray-500'>{conversation.time}</Text>
                                        </View>
                                        <View className='flex-row'>

                                            <Text className='text-gray-500'>{conversation.lastMessage}</Text>
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            ))}

                        </ScrollView>

                    </View>

                </View>
            </View>
            <View className='px-4 py-2 border-t border-gray-100 bg-gray-50'>
                <Text className='text-xs text-gray-500 text-center'>Tap to open . Long press to delete</Text>
            </View>
            <Modal visible={isChatOpen} animationType='slide' presentationStyle='pageSheet' >
                {selectedConversation && (
                    <SafeAreaView className='flex-1'>
                        {/* chat header */}
                        <View className='flex-row items-center px-4 py-3 border-b gap-2 border-gray-100' >
                            <TouchableOpacity onPress={closeChatModel}>
                                <Feather name="arrow-left" size={24} color={"#1da1f2"} />
                            </TouchableOpacity>
                            <Image source={{ uri: selectedConversation.user.avatar }} className='size-10 rounded-full mr-3' />
                            <View className='flex-1'>
                                <Text className=''>{selectedConversation.user.name}</Text>
                                <Text className='text-gray-400 text-sm'>@{selectedConversation.user.username}</Text>
                            </View>

                        </View>
                        {/* chat message area */}
                        <ScrollView className='flex-1 px-4 py-4'>
                            <View className='mb-4' >
                                <Text className='text-center text-gray-400 text-sm mb-4'>This is the begining of your conversation with {selectedConversation.user.name}</Text>


                                {/* conversation messages */}
                                {selectedConversation.messages?.map((message) => (
                                    <View className={`flex-row mb-3 ${message.fromUser ? "justify-end" : ""}`} >
                                        {!message.fromUser && (
                                            <Image source={{ uri: selectedConversation.user.avatar }} className='size-8 rounded-full mr-2' />
                                        )}
                                        <View className={`flex-1 ${message.fromUser ? "items-end" : "items-start"}`} >
                                            <View className={`rounded-2xl px-4 py-3 max-w-xs ${message.fromUser ? "bg-blue-500" : "bg-gray-100"}`} >
                                                <Text className={message.fromUser ? "text-white" : "text-gray-900"}>{message.text}</Text>
                                            </View>
                                            <Text className='text-xs text-gray-400 mt-1'>{message.time}</Text>
                                        </View>

                                    </View>
                                ))}
                            </View>

                        </ScrollView>

                        <View className='flex-row items-center px-4 py-3 border-1 border-gray-100'>
                            <View className='flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-3 mr-3' >
                                <TextInput className='flex-1 text-base'
                                    placeholder='Start the message'
                                    placeholderTextColor={"#657786"}
                                    value={newMessage}
                                    onChangeText={setNewMessage}
                                    multiline
                                />

                            </View>
                            <TouchableOpacity disabled={!newMessage} onPress={sendMessage} className={`size-10 rounded-full items-center justify-center ${newMessage.trim() ? "bg-blue-500" : "bg-gray-300"}`}>
                                {!sendingMessage ? <Feather name="send" size={20} color={"white"} /> :
                                    <ActivityIndicator className='animate-spin' size={"small"} />}
                            </TouchableOpacity>

                        </View>
                    </SafeAreaView>
                )}

            </Modal>
        </SafeAreaView>
    )
}
