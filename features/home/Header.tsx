// app/(home)/components/Header.tsx (atau lokasi kamu sekarang)
import { useEmployeeProfile } from "@/shared/employee/hooks/userEmployees";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

export default function Header() {
  const router = useRouter();
  const { data: emp } = useEmployeeProfile();

  const fullName = emp?.full_name ?? "";
  const dept = emp?.department?.name ?? "";
  const position = emp?.position?.name ?? "";
  const subtitle = [position, dept].filter(Boolean).join(" • ");

  const greeting = useMemo(() => {
  const hour = new Date().getHours();
    if (hour < 12) return "Good Morning,";
    if (hour < 18) return "Good Afternoon,";
    return "Good Evening,"; 
  }, []);

  return (
    <View className="bg-blue-600 rounded-b-3xl px-5 pt-12 pb-4">
      <View className="flex-row justify-between items-start px-2 pb-4">
        <View>
          <Text className="text-white text-3xl font-poppins-bold mb-2">
            {greeting}
          </Text>
          <Text className="text-white text-lg italic font-poppins">
            {fullName || "—"}
          </Text>
          <Text className="text-white text-[11px] italic font-roboto-bold">
            {subtitle}
          </Text>
        </View>
        <View className="flex-row gap-4 pt-4">
          <Pressable className="h-9 w-9 rounded-full items-center justify-center">
            <MaterialIcons name="notifications" size={28} color="#fff" />
          </Pressable>
          <Pressable
            onPress={() => router.push("/(home)/profile")}
            className="h-9 w-9 rounded-full items-center justify-center"
          >
            <MaterialIcons name="person" size={28} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
