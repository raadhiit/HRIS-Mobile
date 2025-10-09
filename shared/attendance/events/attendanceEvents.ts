// shared/events/attendanceEvents.ts
type Handler = () => void;

const todaySubs = new Set<Handler>();

export function onTodayAttendanceChanged(handler: Handler): () => void {
  todaySubs.add(handler);
  return () => {
    todaySubs.delete(handler);
  };
}

export function emitTodayAttendanceChanged(): void {
  // salin agar aman bila handler mengubah set saat iterasi
  for (const h of Array.from(todaySubs)) {
    try {
      h();
    } catch (e) {
      // jangan blokir handler lain
      if (__DEV__) console.warn("[attendanceEvents] handler error:", e);
    }
  }
}
