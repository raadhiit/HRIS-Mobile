import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHome } from "@/shared/api/useHome";
import { getAttendanceHistory } from "@/shared/api/attendanceAPI";
import { mapAttendanceToActivities, Activity } from "@/shared/mappers/attendanceMapper";
import BigActions from "../../features/home/components/BigActions";
import Header from "../../features/home/components/Header";
import MenuGrid from "../../features/home/components/MenuGrid";
import TodayInfo from "../../features/home/components/TodayInfo";

export default function HomeIndex() {
  const { data, error, refresh: refreshHome } = useHome();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // ✅ untuk pull-to-refresh
  const [activities, setActivities] = useState<Activity[]>([]);

  const loadActivities = useCallback(async () => {
    try {
      const res = await getAttendanceHistory();
      if (res.success) {
        const events = mapAttendanceToActivities(res.data.records);
        setActivities(events.slice(0, 1)); // ambil 1 terbaru
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // refresh dua hal: data home & attendance
    refreshHome();
    loadActivities();
  }, [refreshHome, loadActivities]);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} className="flex-1 bg-slate-100">
      <Header />

      {error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-rose-600 font-roboto">{error}</Text>
          <Pressable onPress={() => refreshHome()} className="mt-3 px-4 py-2 bg-emerald-600 rounded-xl">
            <Text className="text-white font-roboto-medium">Coba Lagi</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 12 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <BigActions token="dummy-token-123" onCheckIn={() => {}} onCheckOut={() => {}} />
          {/* <TodayInfo stats={data!.stats} /> */}
          <MenuGrid />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
