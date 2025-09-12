import { HomeDTO } from "./types";

export const mockHome: HomeDTO = {
  user: { name: "Radhitya Harun", role: "IT STAFF" },
  stats: [
    { label: "Hadir Bulan", value: 18, iconName: "calendar-today" }, 
    { label: "Sisa Cuti", value: 4, iconName: "event-busy" },             
  ],
  activities: [
    { title: "Masuk", subtitle: "Hari ini, 08:00 WIB", iconName: "access-time" },
  ],
  history: [
    { date: "Senin, 1 September 2025", status: "approved" },
  ],
};

export type MockUser = {
  id: string,
  name: string;
  email: string;
  role:string;
  password: string;
  twoFactor?:"totp" | "sms" | "email";
};

export const mockUser: MockUser[] = [
  {
    id: "u_001",
    name: "Radhitya Harun",
    role: "IT STAFF",
    email: "radhit@gmail.com",
    password: "password",
    // twoFactor: "totp",
  }
];

/** Dummy token generator */
export function makeToken(userId: string) {
  return `mock.${userId}.${Math.random().toString(36).slice(2, 10)}`;
}