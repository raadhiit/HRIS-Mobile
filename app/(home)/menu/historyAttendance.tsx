// features/home/screens/HistoryAttendance.tsx
import Page from "@/features/home/layouts/Page";
import { getAttendanceHistory } from "@/shared/api/attendanceAPI";
import { mapAttendanceToActivities, type Activity } from "@/shared/attendance/mappers/attendanceMapper";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, Text, View } from "react-native";

/** ---------- List History (aslinya dari History.tsx) ---------- */
function History({ activities }: { activities: Activity[] }) {
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

/** ---------- Screen: History Absensi (aslinya HistoryAttendance.tsx) ---------- */
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <History activities={activities} />
    </Page>
  );
}
