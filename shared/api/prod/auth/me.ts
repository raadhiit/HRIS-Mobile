import { apiJSON } from "@/shared/api/http";

export type MeUser = {
  id: number;
  name?: string | null;
  email?: string | null;
  username?: string | null;
};

export type MeEmployee = {
  id: number;
  employee_code: string;
  rfid_card_number: string | null;
  full_name: string;
  first_name: string;
  last_name: string;
  gender: string | null;
  birth_date: string | null;
  birth_place: string | null;
  phone: string | null;
  address: string | null;
  hire_date: string | null;
  employee_status: string | null;
  photo_path: string | null;
  distance_home_to_office_km: string | null;
  is_active: "0" | "1" | string;
  department?: { id: number; name: string; code: string } | null;
  position?: { id: number; name: string; code: string } | null;
  shift?: { id: number; name: string; code: string; start_time: string | null; end_time: string | null } | null;
  work_location?: {
    id: number;
    name: string;
    code: string;
    address: string | null;
    latitude: string | null;
    longitude: string | null;
    radius_meters: string | null;
  } | null;
};

export type MeResponse = {
  success: boolean;
  message: string;
  data: {
    user: MeUser;
    employee: MeEmployee | null; // jaga-jaga kalau belum ada
  };
  meta?: Record<string, any>;
};

export async function getAuthMe(): Promise<MeResponse["data"]> {
  const res = await apiJSON<MeResponse>("/auth/me", { method: "GET" });
  if (!res?.success) {
    throw new Error(res?.message || "Gagal memuat /auth/me");
  }
  return res.data;
}
