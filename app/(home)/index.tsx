import { useHome } from "@/shared/api/useHome";
import React from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import BigActions from "../../features/home/components/BigActions";
import Header from "../../features/home/components/Header";
import MenuGrid from "../../features/home/components/MenuGrid";
import RecentActivity from "../../features/home/components/RecentActivity";
import TodayInfo from "../../features/home/components/TodayInfo";

export default function HomeIndex() {
  const { data, loading, error, refresh } = useHome();

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <Header />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="mt-2 text-slate-500 font-roboto">Memuat...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-rose-600 font-roboto">{error}</Text>
          <Pressable onPress={refresh} className="mt-3 px-4 py-2 bg-emerald-600 rounded-xl">
            <Text className="text-white font-roboto-medium">Coba Lagi</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
          <BigActions token="dummy-token-123" onCheckIn={() => {}} onCheckOut={() => {}} />
          <TodayInfo stats={data!.stats} />
          <MenuGrid />
          <RecentActivity activities={data!.activities} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

