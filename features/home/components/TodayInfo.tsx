import { Stat } from "@/shared/api/types";
import { useClock } from "@/shared/hooks/useClock";
import { formatJamID, formatTanggalID } from "@/shared/utils/datetime";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import Section from "../components/Section";
import StatsRow from "./StatsRow";

export default function TodayInfo({
  stats,
}: {
  stats: Stat[];
}) {
  const now = useClock(1000);
  const computedDate = formatTanggalID(now);
  const computedTime = `Jam ${formatJamID(now, true)}`;

  return (
    <Section title="Today">
      <View className="flex-row items-center gap-3 mb-3">
        <View className="items-center justify-center rounded-full bg-indigo-100" style={{ width: 50, height: 50 }}>
          {/* icon kecil untuk tanggal */}
          <Text className="text-indigo-600 text-xl">
            <MaterialIcons name="calendar-today" size={24} color="#4F46E5" />
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-poppins-medium text-lg text-slate-800">{computedDate}</Text>
          <Text className="text-base text-slate-500 font-roboto">{computedTime}</Text>
        </View>
      </View>

      <View className="h-px bg-slate-200 my-2" />

      <StatsRow stats={stats} />
    </Section>
  );
}
