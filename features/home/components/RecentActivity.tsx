import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { Activity } from "@/shared/mappers/attendanceMapper";

export default function RecentActivity({ activities }: { activities: Activity[] }) {
  if (!activities || activities.length === 0) {
    return (
      <View className="mx-5 my-3 bg-white rounded-2xl p-4 border border-gray-200 shadow">
        <Text className="font-poppins-medium text-xl text-slate-800 mb-3">
          Aktivitas Terbaru
        </Text>
        <Text className="text-slate-500 text-sm">Belum ada aktivitas</Text>
      </View>
    );
  }

  return (
    <View className="mx-1 bg-white rounded-2xl p-4 border border-gray-200 shadow">

      {activities.map((a, i) => (
        <View
          key={`${a.ts}-${i}`}
          className="flex-row items-center gap-3 rounded-xl px-3 py-2 mb-2"
          style={{ backgroundColor: a.tone.bg }}
        >
          <MaterialIcons name={a.iconName} size={22} color={a.tone.icon} />
          <View className="flex-1">
            <Text className="font-poppins-medium" style={{ color: a.tone.text }}>
              {a.title}
            </Text>
            <Text className="text-xs font-roboto text-slate-500">{a.subtitle}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
