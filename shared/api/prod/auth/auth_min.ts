import { apiJSON, clearToken, getToken, joinUrl, setToken as saveToken } from "@/shared/api/http";
import { getDeviceId } from "@/shared/attendance/device/id";

/** ====== Tipe respons login ====== */
type LoginSuccess = {
  success: true;
  message: string;
  data: {
    token: string;
    user: any;
    employee?: any;
  };
  meta?: Record<string, any>;
};
type LoginFailure = { success: false; message: string; data?: any; meta?: any };
export type LoginResponse = LoginSuccess | LoginFailure;

export async function loginRaw(username: string, password: string, device = "mobile") {
  const deviceId = (await getDeviceId()) || "unknown"; // fallback aman
  const res = await apiJSON<LoginResponse>("/auth/login", {
    method: "POST",
    json: { username, password, device, deviceId },
  });

  if ("success" in res && res.success === false) {
    const msg =
      (typeof res.message === "string" && res.message) ||
      (typeof res.meta?.error === "string" && res.meta.error) ||
      "Login gagal.";
    throw new Error(msg);
  }

  const ok = res as LoginSuccess;
  if (!ok?.data?.token) {
    throw new Error("Token tidak ditemukan pada respons login.");
  }
  return ok;
}

export async function setToken(token: string) {
  await saveToken(token);
}

export async function validateSessionTokenOnly(): Promise<boolean> {
  const token = await getToken();
  if (!token) return false;

  try {
    const res = await fetch(joinUrl("/auth/validate"), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      await clearToken();
      return false;
    }
    const json = await res.json().catch(() => ({}));
    const valid = json?.valid === true || json?.success === true;
    if (!valid) await clearToken();
    return valid;
  } catch {
    await clearToken();
    return false;
  }
}
