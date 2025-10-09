// shared/hooks/useTodayAttendance.ts
import { fetchTodayAttendance } from "@/shared/api/attendanceAPI";
import { onTodayAttendanceChanged } from "@/shared/attendance/events/attendanceEvents";
import { TodayAttendance } from "@/shared/types/attendance";
import { useCallback, useEffect, useState } from "react";

type state = [
  data: TodayAttendance | null,
  loading: boolean,
  error: string | null,
];

export function useTodayAttendance() {
  const [data, setData] = useState<TodayAttendance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await fetchTodayAttendance();
      setData(d);
    } catch (e: any) {
      setError(e?.message || "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => { load(); }, [load]);

  // 🔔 NEW: auto-refresh saat ada perubahan attendance hari ini
  useEffect(() => {
    const unsub = onTodayAttendanceChanged(() => {
      load();
    });
    return unsub;
  }, [load]);

  return { data, loading, error, reload: load };
}
