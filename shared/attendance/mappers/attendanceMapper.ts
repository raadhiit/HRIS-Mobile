import { AttendanceRecord } from "../../types/attendance";

export type Activity = {
  title: string;
  subtitle: string;
  iconName: "login" | "logout";
  ts: number;
  tone: {
    icon: string;
    bg: string;
    text: string;
  };
};

function fmt(date: Date) {
  const hari = date.toLocaleDateString("id-ID", { weekday: "long" });
  const tgl = date.getDate().toString().padStart(2, "0");
  const bln = (date.getMonth() + 1).toString().padStart(2, "0");
  const thn = date.getFullYear();
  const jam = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return `${hari}, ${tgl}-${bln}-${thn}, ${jam} WIB`;
}

export function mapAttendanceToActivities(records: AttendanceRecord[]): Activity[] {
  const events: Activity[] = [];

  for (const r of records) {
    if (r.check_in_time) {
      const d = new Date(r.check_in_time.replace(" ", "T"));
      events.push({
        title: "Masuk",
        subtitle: fmt(d),
        iconName: "login",
        ts: d.getTime(),
        tone: {
          icon: "#2563EB",
          bg: "#EFF6FF",
          text: "#1D4ED8",
        },
      });
    }
    if (r.check_out_time) {
      const d = new Date(r.check_out_time.replace(" ", "T"));
      events.push({
        title: "Keluar",
        subtitle: fmt(d),
        iconName: "logout",
        ts: d.getTime(),
        tone: {
          icon: "#DC2626",
          bg: "#FEF2F2",
          text: "#991B1B",
        },
      });
    }
  }

  // urutkan terbaru -> terlama
  events.sort((a, b) => b.ts - a.ts);
  return events;
}
