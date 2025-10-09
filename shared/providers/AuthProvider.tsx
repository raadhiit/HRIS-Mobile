import {
  getEmployeeProfile,
  type EmployeeProfile,
} from "@/shared/api/employee";
import {
  clearToken,
  setToken as persistToken,
  getToken as readToken,
} from "@/shared/api/http";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type AuthCtxValue = {
  token: string | null;
  employee: EmployeeProfile | null;
  hydrated: boolean;
  setToken: (t: string | null) => Promise<void>;
  setEmployee: (e: EmployeeProfile | null) => void;
  logout: () => Promise<void>;
  refreshEmployee: () => Promise<EmployeeProfile | null>;
};

const AuthCtx = createContext<AuthCtxValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const inflightRef = useRef(false);
  const bootOnceRef = useRef(false);

  // 1) Boot: baca token dari SecureStore sekali
  useEffect(() => {
    (async () => {
      if (bootOnceRef.current) return;
      bootOnceRef.current = true;

      const t = await readToken();
      setTokenState(t ?? null);
      setHydrated(true);
      console.log("[AuthProvider] hydrated. token?", !!t);
    })();
  }, []);

  // 2) Fetch profil HANYA setelah token ada, employee belum ada, dan tidak sedang fetch
  useEffect(() => {
    if (!token) return;
    if (employee) return;
    if (inflightRef.current) return;

    inflightRef.current = true;
    console.log("[AuthProvider] fetch profile start");
    (async () => {
      try {
        const prof = await getEmployeeProfile();
        setEmployee(prof);
        console.log("[AuthProvider] fetch profile done");
      } catch (e: any) {
        console.log("[AuthProvider] fetch profile error", e?.status || e);
        if (e?.status === 401) {
          await clearToken();
          setTokenState(null);
          setEmployee(null);
        }
      } finally {
        inflightRef.current = false;
      }
    })();
  }, [token, employee]);

  // Setter token terpusat
  const setToken = async (t: string | null) => {
    if (t) {
      await persistToken(t);
      setTokenState(t);
    } else {
      await clearToken();
      setTokenState(null);
      setEmployee(null);
    }
  };

  // Optional: refresh manual bila ada aksi update profil
  const refreshEmployee = async (): Promise<EmployeeProfile | null> => {
    if (!token) return null;
    if (inflightRef.current) return employee;
    inflightRef.current = true;
    try {
      console.log("[AuthProvider] refresh profile");
      const prof = await getEmployeeProfile(true);
      setEmployee(prof);
      return prof;
    } catch (e: any) {
      if (e?.status === 401) {
        await clearToken();
        setTokenState(null);
        setEmployee(null);
      }
      return null;
    } finally {
      inflightRef.current = false;
    }
  };

  const logout = async () => {
    await clearToken();
    setTokenState(null);
    setEmployee(null);
  };

  const value = useMemo(
    () => ({
      token,
      employee,
      hydrated,
      setToken,
      setEmployee,
      logout,
      refreshEmployee,
    }),
    [token, employee, hydrated]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
