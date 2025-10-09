import { useClock } from "@/shared/utils/useClock";
import { formatJamID, formatTanggalID } from "@/shared/utils/datetime";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import Section from "./components/Section";

export default function TodayInfo() {
  const now = useClock(1000);
  const computedDate = formatTanggalID(now);
  const computedTime = `Jam ${formatJamID(now, true)}`;

  return (
    <Section title="Today">
      {/* Header waktu perangkat */}
      <View className="flex-row items-center gap-3 mb-3">
        <View
          className="items-center justify-center rounded-full bg-blue-50"
          style={{ width: 50, height: 50 }}
        >
          <MaterialIcons name="calendar-today" size={24} color="#60A5FA" />
        </View>

        <View className="flex-1">
          <Text className="font-poppins-medium text-lg text-slate-800">
            {computedDate}
          </Text>
          <Text className="text-base text-slate-500 font-roboto">
            {computedTime}
          </Text>
        </View>
      </View>
    </Section>
  );
}
