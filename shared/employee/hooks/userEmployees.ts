import type { EmployeeProfile } from "@/shared/api/employee";
import { useAuth } from "@/shared/providers/AuthProvider";
import { useCallback, useMemo } from "react";

export function useEmployeeProfile() {
  const { employee, token, hydrated, refreshEmployee } = useAuth();
  const loading = !hydrated ? true : (!!token && !employee);
  const data = useMemo(() => employee as EmployeeProfile | null, [employee]);
  const refresh = useCallback(() => refreshEmployee(), [refreshEmployee]);

  return {
    data,
    loading,
    ready: hydrated,
    loggedIn: !!token,
    refresh,
  };
}
