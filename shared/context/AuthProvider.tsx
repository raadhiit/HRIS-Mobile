import {
  biometricLogin as apiBiometricLogin,
  login as apiLogin,
  logout as apiLogout,
  me as apiMe,
  verifyTwoFactor as apiVerifyTwoFactor,
} from "@/shared/api/auth";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Profile = {
  id: string;
  name: string;
  email?: string;
  role: string;
  avatar_url?: string | null;
};

type LoginArgs = { email?: string; username?: string; password: string };

interface AuthContextValue {
  user: Profile | null;
  loading: boolean;
  twoFARequired: boolean;
  login: (args: LoginArgs) => Promise<"ok" | "2fa_required">;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  biometricLogin: (args: { device_id: string; biometric_assertion: string }) => Promise<void>;
  verify2FA: (otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [twoFARequired, setTwoFARequired] = useState(false);

  // Boot: cek sesi via /api/auth/profile
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const me = await apiMe<Profile>();
        if (alive) setUser(me);
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const login: AuthContextValue["login"] = useCallback(async (args) => {
    const res = await apiLogin(args);
    if (res.twoFactorRequired) {
      setTwoFARequired(true);
      return "2fa_required";
    }
    // tokens sudah tersimpan oleh API/auth.ts → ambil profil
    const me = await apiMe<Profile>();
    setUser(me);
    setTwoFARequired(false);
    return "ok";
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      setTwoFARequired(false);
    }
  }, []);

  const refreshMe = useCallback(async () => {
    const me = await apiMe<Profile>();
    setUser(me);
  }, []);

  const biometricLogin: AuthContextValue["biometricLogin"] = useCallback(async (args) => {
    await apiBiometricLogin(args); // token disimpan di API/auth.ts
    const me = await apiMe<Profile>();
    setUser(me);
  }, []);

  const verify2FA: AuthContextValue["verify2FA"] = useCallback(async (otp) => {
    await apiVerifyTwoFactor(otp);
    // setelah verify, ambil profil (asumsi backend sudah mengizinkan sesi)
    const me = await apiMe<Profile>();
    setUser(me);
    setTwoFARequired(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      twoFARequired,
      login,
      logout,
      refreshMe,
      biometricLogin,
      verify2FA,
    }),
    [user, loading, twoFARequired, login, logout, refreshMe, biometricLogin, verify2FA]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
