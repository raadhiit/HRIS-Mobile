import HomeSkeleton from "@/features/home/components/skeleton/HomeSkeleton";
import { getAttendanceHistory } from "@/shared/api/attendanceAPI";
import { useHome } from "@/shared/api/useHome";
import { Activity, mapAttendanceToActivities } from "@/shared/attendance/mappers/attendanceMapper";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BigActions from "../../features/home/BigActions";
import Header from "../../features/home/Header";
import MenuGrid from "../../features/home/MenuGrid";
import RecentAct from "../../features/home/RecentActivity";
import TodayInfo from "../../features/home/TodayInfo";
import HeaderSkeleton from "../../features/home/components/skeleton/HeaderSkeleton";

export default function HomeIndex() {
  const { error, refresh: refreshHome } = useHome();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const unmounted = useRef(false);

  const loadActivities = useCallback(async () => {
    try {
      const res = await getAttendanceHistory();
      if (res.success) {
        const events = mapAttendanceToActivities(res.data.records);
        if (!unmounted.current) setActivities(events.slice(0, 1));
      }
    } finally {
      if (!unmounted.current) {
        setLoading(false);
        setRefreshing(false);
        setTimeout(() => {
          if (!unmounted.current) setShowSkeleton(false);
        }, 300);
      }
    }
  }, []);

  useEffect(() => {
    unmounted.current = false;
    loadActivities();
    return () => {
      unmounted.current = true;
    };
  }, [loadActivities]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setShowSkeleton(true);
    refreshHome();
    loadActivities();
  }, [refreshHome, loadActivities]);

  // Initial load → header skeleton + content skeleton
  if (loading && showSkeleton) {
    return (
      <SafeAreaView edges={["left", "right", "bottom"]} className="flex-1 bg-slate-100">
        <HeaderSkeleton />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 12 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <HomeSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} className="flex-1 bg-slate-100">
      {/* Saat refresh → header juga skeleton */}
      {showSkeleton ? <HeaderSkeleton /> : <Header />}

      {error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-rose-600 font-roboto">{error}</Text>
          <Pressable onPress={() => refreshHome()} className="mt-3 px-4 py-2 bg-blue-600 rounded-xl">
            <Text className="text-white font-roboto-medium">Coba Lagi</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 12 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={"#DBEAFE"}
              colors={["#60A5FA"]}
            />
          }
        >
          {showSkeleton ? (
            <HomeSkeleton />
          ) : (
            <>
              <BigActions token="dummy-token-123" onCheckIn={() => {}} onCheckOut={() => {}} />
              <TodayInfo  />
              <MenuGrid />
              <RecentAct />
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
