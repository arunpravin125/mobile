import { Feather } from '@expo/vector-icons'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const TRENDING_TOPICS = [{ topic: "#ReactNative", tweets: "125k" },
{ topic: "#TypeScript", tweets: "89k" },
{ topic: "#WebDevelopment", tweets: "234k" },
{ topic: "#AI", tweets: "56k" },
{ topic: "#React", tweets: "99k" },
{ topic: "#WebDevelopment", tweets: "234k" },
{ topic: "#AI", tweets: "56k" },
{ topic: "#React", tweets: "99k" },
{ topic: "#WebDevelopment", tweets: "234k" },
{ topic: "#AI", tweets: "56k" },
{ topic: "#React", tweets: "99k" },
{ topic: "#WebDevelopment", tweets: "234k" },
{ topic: "#AI", tweets: "56k" },
{ topic: "#React", tweets: "99k" },
{ topic: "#WebDevelopment", tweets: "234k" },
{ topic: "#AI", tweets: "56k" },
{ topic: "#React", tweets: "99k" },
{ topic: "#WebDevelopment", tweets: "234k" },
{ topic: "#AI", tweets: "56k" },
{ topic: "#React", tweets: "99k" }
]

export default function SearchScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* header */}
            <View className='px-3 py-4 flex-1 gap-2 border-gray-100'>
                <View className='flex-row items-center  bg-gray-100 rounded-full px-4 py-3' >
                    <Feather name='search' size={20} color={"#657786"} />
                    <TextInput placeholder='Search Twitter' className='flex-1 ml-3 text-base ' placeholderTextColor={"#657786"} />
                </View>
                <View className=' border border-gray-200 w-full' />
                <ScrollView className='flex-1'  >
                    <View className='p-4' >
                        <Text className='text-xl font-bold text-gray-900 mb-4' >Trending for you</Text>
                        {TRENDING_TOPICS?.map((item, index) => (
                            <TouchableOpacity key={index} className='py-3 border-b border-gray-100' >
                                <Text className='text-gray-500 text-sm'>Trending in Technology</Text>
                                <Text className='font-bold text-gray-900 text-lg'>{item.topic}</Text>
                                <Text className='text-gray-500 text-sm'>{item.tweets} Tweets</Text>

                            </TouchableOpacity>
                        ))}

                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
