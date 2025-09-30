import { joinUrl, getToken, apiJSON } from "@/shared/api/http";
import { getDeviceId } from "../device/id";
import { 
  AttendanceVariant, 
  AttendancePayload, 
  AttendanceResponse,
  AttendanceHistoryResponse  
} from "../types/attendance";

export async function submitAttendanceMobileMultipart(
  variant: AttendanceVariant,
  payload: Omit<AttendancePayload, "type">,
  photoUri: string | null,
  fileField: string = "photo"
): Promise<AttendanceResponse> {
  const path = variant === "in" ? "/attendance/check-in/mobile" : "/attendance/check-out/mobile";
  const url = joinUrl(path);

  const form = new FormData();
  form.append("type", variant === "in" ? "check-in" : "check-out");

  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, String(v));
  });

  if (photoUri) {
    const filename = photoUri.split("/").pop() || "photo.jpg";
    const ext = (filename.split(".").pop() || "jpg").toLowerCase();
    const mime = ext === "png" ? "image/png" : "image/jpeg";
    const fileData = { uri: photoUri, type: mime, name: filename } as any;
    form.append(fileField, fileData);
  } else {
    console.log("[multipart] no photoUri provided, skip file");
  }

  const deviceId = await getDeviceId();
  const token = await getToken();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-Device-Id": deviceId,
    },
    body: form,
    credentials: "omit",
  });

  const text = await (async () => { try { return await res.text(); } catch { return ""; } })();
  let raw: any = null;
  try { raw = text ? JSON.parse(text) : null; } catch {}

  if (!res.ok) {
    throw new Error(raw?.message || raw?.error || `Request gagal (${res.status})`);
  }

  // Normalisasi field supaya konsisten di FE
  const normalized: AttendanceResponse = {
    success: raw?.success ?? true,
    message: raw?.message,
    data: raw?.data,
    meta: raw?.meta,
    allowed: raw?.allowed ?? raw?.data?.allowed ?? false,
    distance: raw?.distance ?? raw?.data?.distance ?? undefined,
    radius: raw?.radius ?? raw?.data?.radius ?? undefined,
    locationName: raw?.locationName ?? raw?.data?.locationName ?? null,
  };

  return normalized;
}

export async function getAttendanceHistory(page = 1) {
  return apiJSON<AttendanceHistoryResponse>(`/attendance/history?page=${page}`, {
    method: "GET",
  });
}
