import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Section from "./components/Section";

type MenuTitle = "Lembur" | "Izin/Cuti" | "Pengaturan" | "History Absensi";

function MenuTile({
  title,
  icon,
  iconColor,
  onPress,
}: {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string; // pakai brand / semantic / accent (ikon saja)
  onPress: () => void;
}) {
  return (
    <Pressable
      className="items-center justify-center rounded-2xl p-4 border border-slate-200 bg-white active:opacity-90"
      onPress={onPress}
      style={{
        elevation: 1,
      }}
    >
      {/* Badge ikon: latar netral */}
      <View className="w-12 h-12 rounded-full items-center justify-center bg-slate-100">
        <MaterialIcons name={icon} size={28} color={iconColor} />
      </View>
      <Text className="mt-2 text-[12px] font-roboto text-slate-700">{title}</Text>
    </Pressable>
  );
}

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
      case "History Absensi":
        router.push("/(home)/historyAttendance");
        break;
    }
  };

  return (
    <Section title="Menu Utama">
      <View className="flex-row flex-wrap -mx-1">
        {/* Lembur → accent kuning pada ikon saja */}
        <View className="w-1/3 px-1 mb-3">
          <MenuTile
            title="Lembur"
            icon="access-time"
            iconColor="#F97316" // amber-600 (accent), background tetap netral
            onPress={() => handleMenuPress("Lembur")}
          />
        </View>

        {/* Izin/Cuti → semantic merah pada ikon (bukan background) */}
        <View className="w-1/3 px-1 mb-3">
          <MenuTile
            title="Izin/Cuti"
            icon="work"
            iconColor="#DC2626" // rose/red-600 (semantic)
            onPress={() => handleMenuPress("Izin/Cuti")}
          />
        </View>

        {/* History Absensi → netral/brand ringan */}
        <View className="w-1/3 px-1 mb-3">
          <MenuTile
            title="History"
            icon="history"
            iconColor="#3B82F6" // emerald-600 (brand)
            onPress={() => handleMenuPress("History Absensi")}
          />
        </View>
      </View>
    </Section>
  );
}
