import { Stat } from "@/shared/api/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <View className="flex-row gap-4">
      {stats.map((s, idx) => (
        <View
          key={idx}
          className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200"
        >
          <View className="flex-row items-center gap-2">
            <MaterialIcons name={s.iconName as any} size={20} color="#374151" />
            <Text className="font-poppins-medium text-slate-800 text-lg">{s.value}</Text>
          </View>
          <Text className="text-[11px] text-slate-500 mt-1 font-roboto">
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
