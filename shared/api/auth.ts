import { Secure } from "../storage/secure";
import { makeToken, mockHome, mockUser } from "./mocks"; // <— ADD
import { HomeDTO } from "./types";


const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:8000";
const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS === "1";              // <— ADD
console.log("[auth] USE_MOCKS =", USE_MOCKS, process.env.EXPO_PUBLIC_USE_MOCKS);

const ACCESS_KEY = "auth.access_token";
const REFRESH_KEY = "auth.refresh_token";

type Json = Record<string, any>;

async function getAccessToken() { return Secure.getItemAsync(ACCESS_KEY); }
async function getRefreshToken() { return Secure.getItemAsync(REFRESH_KEY); }

async function setTokens(access: string, refresh?: string) {
  await Secure.setItemAsync(ACCESS_KEY, access);
  if (refresh) await Secure.setItemAsync(REFRESH_KEY, refresh);
}
export async function clearSession() {
  await Promise.all([
    Secure.deleteItemAsync(ACCESS_KEY),
    Secure.deleteItemAsync(REFRESH_KEY),
  ]);

}

function jsonHeaders() {
  return { Accept: "application/json", "Content-Type": "application/json" };
}

/* -------------------- MOCK ROUTER -------------------- */
async function mockRouter<T = any>(
  path: string,
  opts: RequestInit & { auth?: boolean }
): Promise<T> {
  // parse body jika ada
  let body: any = undefined;
  try { if (opts.body) body = JSON.parse(String(opts.body)); } catch {}

  // helper untuk auth header
  const authHeader =
    (opts.headers as any)?.Authorization || (opts.headers as any)?.authorization;
  const bearer =
    typeof authHeader === "string" && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

  // util untuk build response JSON
  const ok = (data: any) => data as T;
  const err = (message: string): never => { throw new Error(message); };

  // Simulasi latency kecil biar terasa “real”
  await new Promise((r) => setTimeout(r, 450));

  // --------- AUTH ENDPOINTS ----------
  if (
    path === "/api/auth/login" &&
    (opts.method ?? "GET").toUpperCase() === "POST"
  ) {
    const { email, password } = body || {};
    console.log("[MOCK LOGIN] payload =", { email, password });

    const user = mockUser.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase()
    );
    console.log("[MOCK LOGIN] user ditemukan?", !!user, user);

    if (!user) {
      console.log("[MOCK LOGIN] ❌ Akun tidak ditemukan");
      return err("Akun tidak ditemukan");
    }

    if (user.password !== password) {
      console.log(
        "[MOCK LOGIN] ❌ Password salah untuk user",
        user.email,
        "input:",
        password
      );
      return err("Kredensial salah");
    }

    if (user.twoFactor) {
      console.log("[MOCK LOGIN] 2FA diperlukan method =", user.twoFactor);
      return ok({ two_factor_required: true, method: user.twoFactor });
    }

    const access_token = makeToken(user.id);
    const refresh_token = makeToken(user.id);
    console.log("[MOCK LOGIN] ✅ Login berhasil, token =", {
      access_token,
      refresh_token,
    });
    return ok({ access_token, refresh_token, token_type: "bearer" });
  }


  if (path === "/api/auth/refresh" && (opts.method ?? "GET").toUpperCase() === "POST") {
    const access_token = makeToken("refresh");
    const refresh_token = makeToken("refresh");
    return ok({ access_token, refresh_token });
  }

  if (path === "/api/auth/logout" && (opts.method ?? "GET").toUpperCase() === "POST") {
    return ok({ message: "logged out" });
  }

  if (path === "/api/auth/profile") {
    if (!bearer) return err("Unauthorized");
    const u = mockUser[0]; // ambil dummy pertama
    return ok({
      id: u.id,
      name: u.name,
      role: u.role,
      email: u.email,
    });
  }

  if (path === "/api/home") {
    if (!bearer) return err("Unauthorized");
    return ok(mockHome);
  }

  // kalau endpoint tidak ditangani → THROW
  throw new Error(`MOCK: endpoint ${path} belum di-handle`);
}


/* -------------------- HTTP (REAL + MOCK SWITCH) -------------------- */
async function http<T = any>(
  path: string,
  opts: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  // >>>> SHORT-CIRCUIT KE MOCK <<<<
  if (USE_MOCKS) {
    // sisipkan bearer kalau diperlukan
    if (opts.auth) {
      const token = await getAccessToken();
      opts.headers = {
        ...jsonHeaders(),
        ...(opts.headers as any),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
    } else {
      opts.headers = { ...jsonHeaders(), ...(opts.headers as any) };
    }
    return mockRouter<T>(path, opts);
  }

  // ------- REAL FETCH (PROD) -------
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    ...jsonHeaders(),
    ...(opts.headers as any),
  };

  if (opts.auth) {
    const token = await getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...opts, headers });

  if (res.ok) {
    if (res.status === 204) return undefined as unknown as T;
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json")
      ? ((await res.json()) as T)
      : ((await res.text()) as any);
  }

  if (res.status === 401 && opts.auth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return http<T>(path, opts);
    }
  }

  let message = `HTTP ${res.status}`;
  try {
    const body = await res.json();
    message = body?.message || message;
  } catch {}
  throw new Error(message);
}

async function tryRefresh(): Promise<boolean> {
  const refresh = await getRefreshToken();
  if (!refresh) return false;

  const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ refresh_token: refresh }),
  });
  if (!res.ok) {
    await clearSession();
    return false;
  }
  const data = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
  };
  await setTokens(data.access_token, data.refresh_token);
  return true;
}

/** Login pakai email/username (kita pakai email) */
export async function login(payload: {
  email?: string;
  password: string;
}): Promise<{ twoFactorRequired: boolean; method?: "totp" | "sms" | "email" }> {
  const res = await http<Json>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (res?.two_factor_required) {
    return { twoFactorRequired: true, method: res.method };
  }

  if (res?.access_token) {
    await setTokens(res.access_token, res.refresh_token);
    return { twoFactorRequired: false };
  }

  throw new Error("Login response tidak valid");
}

export function verifyTwoFactor(otp: string) {
  return http<{ message: string }>("/api/auth/two-factor/verify", {
    method: "POST",
    body: JSON.stringify({ otp }),
    auth: true,
  });
}

export function enableTwoFactor() {
  return http<{ otpauth_url: string; secret: string; qr_svg?: string }>(
    "/api/auth/two-factor/enable",
    { method: "POST", auth: true }
  );
}

export function biometricLogin(payload: {
  device_id: string;
  biometric_assertion: string;
}) {
  return http<{ access_token: string; refresh_token?: string }>(
    "/api/auth/biometric-login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  ).then(async (res) => {
    if (res?.access_token) await setTokens(res.access_token, res.refresh_token);
    return res;
  });
}

export async function logout() {
  try {
    await http<void>("/api/auth/logout", { method: "POST", auth: true });
  } finally {
    await clearSession();
  }
}

export function me<T = Json>() {
  return http<T>("/api/auth/profile", { auth: true });
}

export function updateProfile<T = Json>(body: Partial<T>) {
  return http<T>("/api/auth/profile", {
    method: "PUT",
    body: JSON.stringify(body),
    auth: true,
  });
}

/* Optional: endpoint data home (kalau kamu mau fetch di Home screen) */
export function getHome() {
  return http<HomeDTO>("/api/home", { auth: true } as any);
}
