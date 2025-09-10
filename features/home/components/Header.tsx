import { useAuth } from "@/shared/context/AuthProvider";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Header() {
    const router = useRouter();
    const { user } = useAuth();
    return (
        <View className="bg-emerald-600 rounded-b-3xl px-5 pt-14 pb-4">
            <View className="flex-row justify-between items-start px-2 pb-4">
                <View>
                    <Text className="text-white text-3xl font-poppins-bold mb-2">Good Morning,</Text>
                    <Text className="text-white text-lg italic font-poppins">{user?.name}</Text>
                    <Text className="text-white text-[11px] italic font-roboto-bold">{user?.role}</Text>
                </View>
                <View className="flex-row gap-4 pt-4">
                    <Pressable className="h-9 w-9 rounded-full items-center justify-center">
                        <MaterialIcons name='notifications' size={28} color="#fff" />
                    </Pressable>
                    <Pressable 
                        onPress={() => router.push("/(home)/profile")}
                        className="h-9 w-9 rounded-full items-center justify-center"
                    >
                        <MaterialIcons name='person' size={28} color="#fff" />
                    </Pressable>
                </View>
            </View>
        </View>
    )
}