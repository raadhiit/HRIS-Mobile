import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { submitAttendanceMobileMultipart } from "@/shared/api/attendanceAPI";
import { AttendanceResponse, AttendanceVariant } from "@/shared/types/attendance";
import type { Coords } from "@/shared/types/attendance"; // <- pakai Coords yang sudah extend

type SubmitExtra = {
  userId?: number | null;
  locationName?: string | null;
  coords?: Coords | null; // <- penting: sinkron dengan tipe Coords kamu
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
          // payload ke server
          user_id: extra.userId ?? null,
          location_name: extra.locationName ?? null,
          latitude: extra.coords?.latitude ?? null,
          longitude: extra.coords?.longitude ?? null,
          accuracy: extra.coords?.accuracy ?? null,
          captured_at: extra.coords?.timestamp ?? Date.now(),

          // ---- meta kualitas pembacaan (opsional tapi disarankan) ----
          location_speed: extra.coords?.speed ?? null,
          location_age_ms: extra.coords?.ageMs ?? null,
          location_mocked: extra.coords?.mocked ?? null,
          client_location_meta: extra.coords
            ? JSON.stringify({
                accuracy: extra.coords.accuracy ?? null,
                speed: extra.coords.speed ?? null,
                ageMs: extra.coords.ageMs ?? null,
                mocked: extra.coords.mocked ?? null,
                ts: extra.coords.timestamp ?? Date.now(),
              })
            : undefined,
          client_now_ms: Date.now(),
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
