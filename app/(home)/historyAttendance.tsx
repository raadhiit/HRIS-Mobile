import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, Text, View } from "react-native";
import Page from "@/features/home/layouts/Page";
import { getAttendanceHistory } from "@/shared/api/attendanceAPI";
import { mapAttendanceToActivities, Activity } from "@/shared/mappers/attendanceMapper";
import RecentActivity from "@/features/home/components/RecentActivity";

export default function HistoryAttendance() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await getAttendanceHistory();
      if (res.success) {
        const events = mapAttendanceToActivities(res.data.records);
        setActivities(events);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  if (loading) {
    return (
      <Page 
        title="History Absensi" 
        showBackButton
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
        <View className="mt-6 items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-2 text-slate-500 font-roboto">Memuat riwayat…</Text>
        </View>
      </Page>
    );
  }

  return (
    <Page
      title="History Absensi"
      showBackButton
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // ✅
    >
      <RecentActivity activities={activities} />
    </Page>
  );
}
