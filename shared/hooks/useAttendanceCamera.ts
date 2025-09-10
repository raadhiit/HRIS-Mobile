// hooks/useAttendanceCamera.ts
import { submitAttendance } from "@/shared/api/attendanceAPI";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export function useAttendanceCamera(token: string) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const takePhoto = async () => {
    setError(null);
    // minta izin kamera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setError("Izin kamera ditolak.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      cameraType: ImagePicker.CameraType.front, // selfie
      allowsEditing: false,
      exif: false,
      base64: false,
    });

    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) {
      setError("Gagal mengambil foto.");
      return;
    }
    setPhotoUri(asset.uri);
    console.log("[useAttendanceCamera] foto:", asset.uri);
  };

  const submit = async (type: "in" | "out", extra?: Record<string, any>) => {
    if (!photoUri) {
      setError("Belum ada foto diambil.");
      return;
    }
    setLoading(true);
    try {
      const ts = new Date().toISOString();
      const res = await submitAttendance({ photoUri, type, token, extra: { ts, ...extra } });
      console.log("[useAttendanceCamera] Presensi sukses:", res);
      return res;
    } catch (e: any) {
      console.error("[useAttendanceCamera] Presensi gagal:", e?.message || e);
      setError(e?.message || "Upload gagal");
    } finally {
      setLoading(false);
    }
  };

  return { photoUri, takePhoto, submit, loading, error, setPhotoUri };
}
