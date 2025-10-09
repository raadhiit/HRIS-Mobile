import { apiJSON, getToken, joinUrl } from "@/shared/api/http";
import { getDeviceId } from "../attendance/device/id";
import {
  AttendanceHistoryResponse,
  AttendancePayload,
  AttendanceResponse,
  AttendanceVariant,
  TodayAttendance
} from "../types/attendance";

type TodayAttendanceResponse = {
  data: {
    has_attendance: boolean;
    attendance?: Partial<TodayAttendance>;
  };
};

/* =========================
   Small, local helpers
   ========================= */

const variantToMeta = (variant: AttendanceVariant) => {
  const type = variant === "in" ? "check-in" : "check-out";
  const path = `/attendance/${type}/mobile`;
  return { type, path };
};

const appendPayloadToForm = (form: FormData, payload: Record<string, unknown>) => {
  for (const [k, v] of Object.entries(payload)) {
    if (v !== undefined && v !== null) form.append(k, String(v));
  }
};

const pickMimeFromExt = (filename: string) => {
  const ext = (filename.split(".").pop() || "").toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  return "image/jpeg";
};

const buildFilePart = (uri: string, fieldName: string, form: FormData) => {
  const name = uri.split("/").pop() || "photo.jpg";
  const type = pickMimeFromExt(name);
  form.append(fieldName, { uri, type, name } as any);
};

const safeParseJSON = (text: string | null) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const normalizeAttendanceResponse = (raw: any): AttendanceResponse => {
  return {
    success: raw?.success ?? true,
    message: raw?.message,
    data: raw?.data,
    meta: raw?.meta,
    allowed: raw?.allowed ?? raw?.data?.allowed ?? false,
    distance: raw?.distance ?? raw?.data?.distance ?? undefined,
    radius: raw?.radius ?? raw?.data?.radius ?? undefined,
    locationName: raw?.locationName ?? raw?.data?.locationName ?? null,
  };
};

/* =========================
   Public API (unchanged signatures)
   ========================= */

export async function submitAttendanceMobileMultipart(
  variant: AttendanceVariant,
  payload: Omit<AttendancePayload, "type">,
  photoUri: string | null,
  fileField: string = "photo"
): Promise<AttendanceResponse> {
  const { type, path } = variantToMeta(variant);
  const url = joinUrl(path);

  const form = new FormData();
  form.append("type", type);
  appendPayloadToForm(form, payload);

  if (photoUri) {
    buildFilePart(photoUri, fileField, form);
  } else {
    console.log("[multipart] no photoUri provided, skip file");
  }

  const [deviceId, token] = await Promise.all([getDeviceId(), getToken()]);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "X-Device-Id": deviceId,
      },
      body: form,
      credentials: "omit",
    });
  } catch (e: any) {
    throw new Error(e?.message || "Gagal terhubung ke server.");
  }

  const text = await (async () => {
    try {
      return await res.text();
    } catch {
      return "";
    }
  })();

  const raw = safeParseJSON(text);

  if (!res.ok) {
    const msg = raw?.message || raw?.error || `Request gagal (${res.status})`;
    throw new Error(msg);
  }

  return normalizeAttendanceResponse(raw);
}

export async function getAttendanceHistory(page = 1) {
  return apiJSON<AttendanceHistoryResponse>(`/attendance/history?page=${page}`, {
    method: "GET",
  });
}

// ✅ Return type tetap TodayAttendance (tidak diubah)
export async function fetchTodayAttendance(): Promise<TodayAttendance> {
  const res = await apiJSON<TodayAttendanceResponse>("/attendance/today", {
    method: "GET",
  });

  const att = res?.data?.attendance ?? {};

  return {
    check_in_time: att.check_in_time ?? null,
    check_out_time: att.check_out_time ?? null,
    formatted_work_duration: att.formatted_work_duration ?? "0h 0m",
    overtime_duration_minutes: att.overtime_duration_minutes ?? "0",
    overtime_hours: att.overtime_hours ?? 0,
  };
}
