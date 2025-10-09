import { getAuthMe, type MeEmployee } from "@/shared/api/prod/auth/me";

export type EmployeeProfile = MeEmployee & { user_id?: number };

let inflightProfile: Promise<EmployeeProfile> | null = null;

export async function getEmployeeProfile(force = false): Promise<EmployeeProfile> {
  if (!force && inflightProfile) return inflightProfile;

  inflightProfile = (async () => {
    const me = await getAuthMe(); // { user, employee }
    const emp = me.employee as MeEmployee | null;

    if (!emp) {
      // kalau employee null, tetap pulangkan minimal object berisi user_id
      return { 
        id: 0,
        employee_code: "",
        rfid_card_number: null,
        full_name: me.user.name ?? "",
        first_name: me.user.name ?? "",
        last_name: "",
        gender: null,
        birth_date: null,
        birth_place: null,
        phone: null,
        address: null,
        hire_date: null,
        employee_status: null,
        photo_path: null,
        distance_home_to_office_km: null,
        is_active: "1",
        department: null,
        position: null,
        shift: null,
        work_location: null,
        user_id: me.user.id,
      } as EmployeeProfile;
    }

    return { ...emp, user_id: me.user.id } as EmployeeProfile;
  })();

  try {
    return await inflightProfile;
  } finally {
    inflightProfile = null;
  }
}
