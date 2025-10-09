import Section from "@/features/home/components/Section";
import { useTodayAttendance } from "@/shared/attendance/hooks/useTodayAttendance";
import { MaterialIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";

// Helper parse waktu server "YYYY-MM-DD HH:mm:ss"
function parseServerTs(ts: string | null): Date | null {
  if (!ts) return null;
  return new Date(ts.replace(" ", "T"));
}

// Helper format menit -> "Xh Ym"
function fmtMinutes(mins: number | null | undefined) {
  if (mins == null || Number.isNaN(mins)) return "0m";
  const h = Math.floor(mins / 60);
  const m = Math.max(0, mins % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function StatTile({
  icon,
  iconColor,
  badgeBg,
  title,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  badgeBg: string; // netral untuk latar badge
  title: string;
  value: string;
}) {
  return (
    <View
      className="flex-1 mx-1 rounded-2xl border border-slate-200 bg-white p-3"
      style={{
        elevation: 1,
      }}
    >
      {/* Header: ikon + label */}
      <View className="flex-row items-center">
        <View
          className="items-center justify-center rounded-full"
          style={{ width: 30, height: 30, backgroundColor: badgeBg }}
        >
          <MaterialIcons name={icon} size={18} color={iconColor} />
        </View>
        <Text className="ml-2 text-slate-500 text-sm font-roboto">
          {title}
        </Text>
      </View>

      {/* Nilai utama */}
      <Text className="mt-2 text-slate-900 font-poppins-medium text-lg">
        {value}
      </Text>
    </View>
  );
}

export default function RecentAct() {
  const { data, loading, error } = useTodayAttendance();

  const checkInLabel = useMemo(() => {
    const d = parseServerTs(data?.check_in_time ?? null);
    return d ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(":", ".") : "-";
  }, [data?.check_in_time]);
  
  const checkOutLabel = useMemo(() => {
    const d = parseServerTs(data?.check_out_time ?? null);
    return d ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(":", ".") : "-";
  }, [data?.check_out_time]);

  const workDurationLabel = data?.formatted_work_duration ?? "0h 0m";

  const overtimeLabel = useMemo(() => {
    const rawMinutes =
      (data as any)?.overtime_duration_minutes != null
        ? parseInt((data as any).overtime_duration_minutes, 10)
        : (data as any)?.overtime_hours != null
        ? Math.round((data as any).overtime_hours * 60)
        : 0;
    return fmtMinutes(Number.isFinite(rawMinutes) ? rawMinutes : 0);
  }, [data]);

    return (
        <Section title="Recent Activity">
            {loading ? (
            <View className="flex-row items-center gap-2">
                <ActivityIndicator />
                <Text className="text-slate-600">Memuat kehadiran hari ini…</Text>
            </View>
            ) : error ? (
            <View className="rounded-2xl border border-rose-200 bg-rose-50 p-3">
                <Text className="text-rose-700">{error}</Text>
            </View>
            ) : (
            <View className="rounded-2xl">
                <View className="flex-row -mx-1 mb-2">
                <StatTile
                    icon="login"
                    iconColor="#3B82F6"   // ✅ Brand (blue-600)
                    badgeBg="#F1F5F9"     // Neutral (slate-100)
                    title="Check-in"
                    value={checkInLabel}
                />
                <StatTile
                    icon="logout"
                    iconColor="#DC2626"   // ✅ Semantic (red)
                    badgeBg="#F1F5F9"     // Neutral
                    title="Check-out"
                    value={checkOutLabel}
                />
                </View>

                <View className="flex-row -mx-1">
                <StatTile
                    icon="schedule"
                    iconColor="#3B82F6"   // gunakan brand color biru (konsisten)
                    badgeBg="#F1F5F9"
                    title="Durasi"
                    value={workDurationLabel}
                />
                <StatTile
                    icon="timer"
                    iconColor="#DC2626"   // warna semantic merah utk overtime (aksi berat)
                    badgeBg="#F1F5F9"
                    title="Overtime"
                    value={overtimeLabel}
                />
                </View>
            </View>
            )}
        </Section>
    );

}
