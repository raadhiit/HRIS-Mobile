// utils/datetime.ts
export function formatTanggalID(date: Date) {
  // Contoh: "Senin, 1 September 2025"
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatJamID(date: Date, withSeconds = false) {
  // Contoh: "16.15" atau "16.15.42"
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: withSeconds ? "2-digit" : undefined,
    hour12: false,
  }).replace(/:/g, "."); // opsional: ganti ":" jadi "." biar konsisten gaya Indonesia
}
