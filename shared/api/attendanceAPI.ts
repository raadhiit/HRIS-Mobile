// API/attendanceApi.ts
export async function submitAttendance({
  photoUri,
  type,
  token,
  extra = {},
}: {
  photoUri: string;
  type: "in" | "out";
  token: string;
  extra?: Record<string, any>; // bisa kirim lat/long, timestamp, userId, dll
}) {
  const form = new FormData();
  form.append("photo", {
    uri: photoUri,
    type: "image/jpeg",
    name: `attendance-${type}.jpg`,
  } as any);
  form.append("type", type);
  Object.entries(extra).forEach(([k, v]) => form.append(k, String(v)));

  const res = await fetch("https://api.example.com/presensi", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "Upload gagal");
    throw new Error(message);
  }
  return res.json();
}
