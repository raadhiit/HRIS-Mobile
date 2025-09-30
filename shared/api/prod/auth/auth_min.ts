import { apiJSON, clearToken, joinUrl, setToken as saveToken, getToken } from "@/shared/api/http";
import { getDeviceId } from "@/shared/device/id";
import { getEmployeeProfile, type EmployeeProfile } from "@/shared/api/prod/profile/employee";

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

/** ✅ Raw login: tidak set token, tidak fetch profil */
export async function loginRaw(username: string, password: string, device = "mobile") {
  const deviceId = await getDeviceId();
  const res = await apiJSON<LoginResponse>("/auth/login", {
    method: "POST",
    json: { username, password, device, deviceId },
  });

  if ("success" in res && res.success === false) {
    throw new Error(res.message || "Login gagal.");
  }
  const ok = res as LoginSuccess;
  if (!ok?.data?.token) throw new Error("Token tidak ditemukan pada respons login.");
  return ok;
}

/** Helper set token (boleh dipanggil dari AuthProvider / screen login) */
export async function setToken(token: string) {
  await saveToken(token);
}

/** Logout: coba API, tapi apapun hasilnya, hapus token lokal */
export async function logout() {
  try {
    await apiJSON("/auth/logout", { method: "POST" });
  } catch {
    // abaikan error server
  } finally {
    await clearToken();
  }
}

/** ✅ Best practice: validasi session tanpa network (cegah spam API) */
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
      // 401/403/5xx → anggap invalid
      await clearToken();
      return false;
    }
    const json = await res.json().catch(() => ({}));
    // Sesuaikan dengan respons backendmu
    const valid = json?.valid === true || json?.success === true;
    if (!valid) await clearToken();
    return valid;
  } catch {
    // server mati / jaringan error → invalid
    await clearToken();
    return false;
  }
}

/** ⚠️ Opsional: validasi + fetch profil (akan network call) */
export async function validateSession(): Promise<EmployeeProfile | null> {
  try {
    const token = await getToken();
    if (!token) return null;
    const profile = await getEmployeeProfile(); // dedupe menangani paralel
    return profile;
  } catch (e: any) {
    if (e?.status === 401) await clearToken();
    return null;
  }
}
