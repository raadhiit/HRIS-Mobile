import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Section from "../components/Section";

type MenuTitle = "Lembur" | "Izin/Cuti" | "Pengaturan";

export default function MenuGrid() {
  const router = useRouter();

  const handleMenuPress = (menuTitle: MenuTitle) => {
    switch (menuTitle) {
      case "Lembur":
        router.push("/(home)/overtime");
        break;

      case "Izin/Cuti":
        router.push("/(home)/leave");
        break;

      case "Pengaturan":
        router.push("/(home)/setting");
        break;
    }
  };

  return (
    <Section title="Menu Utama">
      <View className="flex-row gap-3">
        {/* Lembur/Overtime */}
        <Pressable
          className="flex-1 items-center rounded-2xl p-4 border border-yellow-200 bg-yellow-50 shadow-sm active:opacity-80"
          onPress={() => handleMenuPress("Lembur")}
        >
          <View className="w-12 h-12 rounded-full items-center justify-center bg-yellow-100">
            <MaterialIcons name="access-time" size={28} color="#EAB308" />
          </View>
          <Text className="mt-2 text-[12px] font-roboto text-yellow-700">Lembur</Text>
        </Pressable>

        {/* izin/Cuti */}
        <Pressable
          className="flex-1 items-center rounded-2xl p-4 border border-rose-200 bg-rose-50 shadow-sm active:opacity-80"
          onPress={() => handleMenuPress("Izin/Cuti")}
        >
          <View className="w-12 h-12 rounded-full items-center justify-center bg-rose-100">
            <MaterialIcons name="work" size={28} color="#F43F5E" />
          </View>
          <Text className="mt-2 text-[12px] font-roboto text-rose-700">Izin/Cuti</Text>
        </Pressable>

        {/* Setting */}
        <Pressable
          className="flex-1 items-center rounded-xl p-4 border border-gray-200 bg-gray-50 shadow-sm active:opacity-80"
          onPress={() => handleMenuPress("Pengaturan")}
        >
          <View className="w-12 h-12 rounded-full items-center justify-center bg-gray-100">
            <MaterialIcons name="settings" size={28} color="#374151" />
          </View>
          <Text className="mt-2 text-[12px] font-roboto text-gray-700">Setting</Text>
        </Pressable>
      </View>
    </Section>
  );
}
