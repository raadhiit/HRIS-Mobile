// shared/api/http.ts
import * as SecureStore from "expo-secure-store";
import { getDeviceId } from "../attendance/device/id";

const RAW_BASE = process.env.EXPO_PUBLIC_API_URL || "";
export const BASE = RAW_BASE.replace(/\/+$/, "");
const ACCESS_KEY = "auth.access_token";

export async function getToken() {
  return SecureStore.getItemAsync(ACCESS_KEY);
}

export async function setToken(val: string) {
  await SecureStore.setItemAsync(ACCESS_KEY, val);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
}

async function readTextSafe(res: Response) {
  try { return await res.text(); } catch { return ""; }
}

export function joinUrl(path: string) {
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function apiJSON<T = any>(
  path: string,
  init: RequestInit & { json?: Record<string, any> } = {}
): Promise<T> {
  const headers: HeadersInit = { Accept: "application/json", ...(init.headers ?? {}) };

  const token = await getToken();
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;

  const deviceId = await getDeviceId();
  // (opsional) kirim selalu device id
  (headers as Record<string, string>)["X-Device-Id"] = deviceId;

  let body: BodyInit | null | undefined;
  if (init.json !== undefined) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
    body = JSON.stringify(init.json);
  } else {
    body = init.body ?? undefined;
  }

  const url = joinUrl(path);

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers,
      body,
      credentials: "omit",
    });
  } catch (e: any) {
    // ⬇️ Server down / fetch gagal → anggap sesi tidak valid, paksa logout
    await clearToken();
    const err = new Error("Tidak bisa menghubungi server. Silakan login lagi.");
    (err as any).cause = e;
    (err as any).status = 0;
    throw err;
  }

  const text = await readTextSafe(res);
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch {}

  // ⬇️ 401 → token invalid/setelah server restart → hapus token & paksa login
  if (res.status === 401) {
    await clearToken();
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      (res.status === 401
        ? "Sesi berakhir. Silakan login kembali."
        : res.status === 403
        ? "Perangkat tidak diizinkan untuk akun ini."
        : `Request gagal (${res.status})`);

    const err = new Error(msg);
    (err as any).status = res.status;
    (err as any).data = data ?? text;
    throw err;
  }

  if (res.status === 204) return undefined as T;

  return (data ?? {} as T);
}


