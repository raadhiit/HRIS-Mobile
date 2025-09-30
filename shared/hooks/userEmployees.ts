import { useMemo, useCallback } from "react";
import { useAuth } from "@/shared/providers/AuthProvider";
import type { EmployeeProfile } from "@/shared/api/prod/profile/employee";

export function useEmployeeProfile() {
  const { employee, token, hydrated, refreshEmployee } = useAuth();
  const loading = !hydrated ? true : (!!token && !employee);
  const data = useMemo(() => employee as EmployeeProfile | null, [employee]);
  const refresh = useCallback(() => refreshEmployee(), [refreshEmployee]);

  return {
    data,      // EmployeeProfile | null (sekarang punya user_id)
    loading,   // boolean
    ready: hydrated,
    loggedIn: !!token,
    refresh,   // () => Promise<EmployeeProfile | null>
  };
}
