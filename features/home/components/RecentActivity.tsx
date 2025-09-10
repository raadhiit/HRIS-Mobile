import { Activity } from "@/shared/api/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import Section from "../components/Section";

export default function RecentActivity({ activities }: { activities: Activity[] }) {
  return (
    <Section title="Aktivitas Terbaru">
      {activities.map((a, i) => (
        <View key={i} className="flex-row items-center gap-3">
          <MaterialIcons name={a.iconName as any} size={22} color="#374151" />
          <View className="flex-1">
            <Text className="font-poppins-medium text-slate-800">{a.title}</Text>
            <Text className="text-xs text-slate-500 font-roboto">{a.subtitle}</Text>
          </View>
        </View>
      ))}
    </Section>
  );
}
