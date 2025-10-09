import { useEffect, useState } from "react";
import { Activity, mapAttendanceToActivities } from "../attendance/mappers/attendanceMapper";
import { getAttendanceHistory } from "./attendanceAPI";

export function useHome() {
  const [data, setData] = useState<{ stats: any; activities: Activity[]; pagination: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  async function refresh(p: number = 1) {
    try {
      setLoading(true);
      setError(null);

      const res = await getAttendanceHistory(p);
      if (res.success) {
        setData({
          stats: res.data.summary,
          activities: mapAttendanceToActivities(res.data.records),
          pagination: res.data.pagination,   // ✅ simpan meta
        });
        setPage(res.data.pagination.current_page);
      } else {
        setError(res.message || "Gagal memuat data");
      }
    } catch (e: any) {
      setError(e.message || "Tidak bisa memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(1); }, []);

  return { data, loading, error, refresh, page };
}
