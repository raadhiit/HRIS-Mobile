export type AttendanceVariant = "in" | "out";
export type Variant = "in" | "out";
export type Coords = { latitude: number; longitude: number; accuracy?: number | null; timestamp?: number };

export type AttendancePayload = {
  type: "check-in" | "check-out";
  user_id?: number | null;
  location_name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  captured_at?: number;
};

export type AttendanceResponse = {
  success: boolean;
  message?: string;
  data?: any;
  meta?: any;

  // === Normalisasi hasil validasi BE ===
  allowed?: boolean;
  distance?: number;
  radius?: number;
  locationName?: string | null;
};

export interface ModalAttendanceProps  {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  variant: Variant;
  locationName?: string;
  token: string;
  coords?: Coords | null;
  userId?: number | null;
}

export type BackendDistancePayload = {
  allowed?: boolean;
  distance_meters?: number | null;
  radius_meters?: number | null;
  message?: string;
};

export type AttendanceRecord = {
  id: number;
  attendance_date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  check_in_method: string | null;
  check_out_method: string | null;
  is_late: boolean;
  formatted_work_duration: string;
  formatted_late_duration: string;
  status: string;
  check_in_photo_path: string | null;
  check_out_photo_path: string | null;
  is_complete: boolean;
  total_work_hours: number;
};

export type AttendanceHistoryResponse = {
  success: boolean;
  message: string;
  data: {
    records: AttendanceRecord[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    summary: {
      total_days: number;
      present_days: number;
      late_days: number;
    };
  };
  meta: {
    timestamp: string;
    version: string;
  };
};