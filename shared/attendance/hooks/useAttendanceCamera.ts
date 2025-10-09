import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { submitAttendanceMobileMultipart } from "@/shared/api/attendanceAPI";
import { AttendanceResponse, AttendanceVariant } from "@/shared/types/attendance";

type SubmitExtra = {
  userId?: number | null;
  locationName?: string | null;
  coords?: {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    timestamp?: number;
  } | null;
};

export function useAttendanceCamera(token: string) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function takePhoto() {
    setError(null);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setError("Izin kamera ditolak.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.6, 
      base64: false,
      exif: false,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function submit(
    variant: AttendanceVariant,
    extra: SubmitExtra = {}
  ): Promise<AttendanceResponse | null> {
    try {
      setLoading(true);
      setError(null);

      if (!photoUri) {
        setError("Foto wajib diambil sebelum submit.");
        return null;
      }

      const fileName = photoUri.split("/").pop();
      if (!fileName) {
        setError("Tidak bisa membaca nama file foto.");
        return null;
      }

      const res = await submitAttendanceMobileMultipart(
        variant,
        {
          user_id: extra.userId ?? null,
          latitude: extra.coords?.latitude ?? null,
          longitude: extra.coords?.longitude ?? null,
        },
        photoUri
      );

      return res;
    } catch (e: any) {
      const msg = e?.message || "Gagal menyimpan presensi.";
      console.log("[attendance submit] error:", msg);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { photoUri, setPhotoUri, takePhoto, submit, loading, error };
}
