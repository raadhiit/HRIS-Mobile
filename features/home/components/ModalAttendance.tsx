// components/ModalAttendance.tsx
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";
import { useAttendanceCamera } from "@/shared/hooks/attendance/useAttendanceCamera";
import { formatJamID, formatTanggalID } from "@/shared/utils/datetime";
import { distanceMeters, toNumberOrNull } from "@/shared/types/geo";
import { useEmployeeProfile } from "@/shared/hooks/userEmployees";
import React, { useMemo, useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { BackendDistancePayload, ModalAttendanceProps } from "@/shared/types/attendance";

export default function ModalAttendance({
  visible,
  onClose,
  onConfirm,
  variant,
  locationName = "RS Harapan Mulia",
  token,
  coords,
  userId,
}: ModalAttendanceProps) {
  const now = new Date();
  const title = variant === "in" ? "Masuk" : "Keluar";

  // warna tombol & kartu waktu tetap seperti sebelumnya
  const tone = {
    cardBg: variant === "in" ? "bg-emerald-50" : "bg-rose-50",
    cardBorder: variant === "in" ? "border-emerald-100" : "border-rose-100",
    timeTxt: variant === "in" ? "text-emerald-700" : "text-rose-700",
    pillBg: variant === "in" ? "bg-emerald-500" : "bg-rose-500",
  };

  const { data: emp } = useEmployeeProfile();
  const { photoUri, takePhoto, submit, loading, error, setPhotoUri } = useAttendanceCamera(token);

  // ======== Hitung jarak & allowed **di sisi UI** (pra-submit) ========
  const office = emp?.work_location;
  const officeLat = useMemo(() => toNumberOrNull(office?.latitude), [office?.latitude]);
  const officeLon = useMemo(() => toNumberOrNull(office?.longitude), [office?.longitude]);
  const officeRadius = useMemo(() => toNumberOrNull(office?.radius_meters), [office?.radius_meters]);

  const uiDistance = useMemo(() => {
    if (!coords || officeLat == null || officeLon == null) return null;
    return distanceMeters(coords.latitude, coords.longitude, officeLat, officeLon);
  }, [coords, officeLat, officeLon]);

  // toleransi kecil berdasarkan akurasi (maks 10 m)
  const accTol = useMemo(() => Math.min(10, (coords?.accuracy ?? 0) * 0.5), [coords?.accuracy]);

  const uiAllowed = useMemo(() => {
    if (uiDistance == null || officeRadius == null) return true; // jika data kantor tidak lengkap, jangan menghalangi
    const effectiveRadius = officeRadius + accTol;
    return uiDistance <= effectiveRadius;
  }, [uiDistance, officeRadius, accTol]);

  // ======== State hasil dari backend (post-submit) ========
  const [serverInfo, setServerInfo] = useState<BackendDistancePayload | null>(null);

  const showAllowed = serverInfo?.allowed ?? uiAllowed;
  const showDistance = serverInfo?.distance_meters ?? uiDistance ?? null;
  const showRadius = serverInfo?.radius_meters ?? officeRadius ?? null;

  const toneCardBg = showAllowed ? "bg-emerald-50" : "bg-rose-50";
  const toneCardBorder = showAllowed ? "border-emerald-100" : "border-rose-100";
  const dotColor = showAllowed ? "bg-emerald-500" : "bg-rose-500";
  const titleText = showAllowed ? "Lokasi Di Dalam Radius" : "Lokasi Berada Di Luar Radius";

  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  const handleConfirmPress = async () => {
    const action = variant === "in" ? "MASUK" : "KELUAR";
    console.log(`[ModalAttendance] Aksi: ${action} pada ${now.toISOString()}`);

    const res = await submit(variant, {
      userId,
      locationName,
      coords: coords
        ? {
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy ?? undefined,
            timestamp: coords.timestamp ?? Date.now(),
          }
        : null,
    });

    if (res) {
      setServerInfo({
        allowed: res.allowed,
        distance_meters: res.distance ?? null,
        radius_meters: res.radius ?? null,
        message: res.message,
      });

      setSubmitMsg(res.message ?? null);

      if (res.success) {
        // === Notifikasi sukses ===
        const timeStr = `${formatJamID(new Date(), false)} • ${formatTanggalID(new Date())}`;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({
          type: "attendanceSuccess",
          position: "bottom",
          topOffset: 14,
          visibilityTime: 2500,
          props: {
            variant,
            timeStr, 
            location: locationName,
          },
        });

        onConfirm?.();
        onClose();
        setPhotoUri(null);
      }
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/40">
        <View className="flex-1 mt-8 mb-4 mx-3 rounded-3xl overflow-hidden">
          <View className="flex-1 bg-white rounded-3xl">
            {/* Header */}
            <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
              <Text className="text-lg font-poppins-semibold text-slate-800">{title}</Text>
              <Pressable onPress={onClose} className="h-8 w-8 rounded-full items-center justify-center bg-slate-100">
                <Text className="text-slate-600 text-base">✕</Text>
              </Pressable>
            </View>

            {/* Kartu Jam & Tanggal */}
            <View className={`mx-4 mt-1 rounded-2xl px-4 py-3 border ${tone.cardBg} ${tone.cardBorder}`}>
              <Text className={`text-3xl font-poppins-semibold text-center ${tone.timeTxt}`}>
                {formatJamID(now, false)}
              </Text>
              <Text className="text-center text-slate-500 mt-1">{formatTanggalID(now)}</Text>
            </View>

            {/* Ambil Foto */}
            <View className="px-4">
              <Text className="mt-4 mb-2 font-poppins-medium text-slate-800">Ambil Foto Selfie</Text>

              <View className="rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                <View className="px-5 py-6 items-center justify-center">
                  {photoUri ? (
                    <>
                      <Image source={{ uri: photoUri }} className="w-full h-48 rounded-xl mb-3" />
                      <Pressable onPress={() => setPhotoUri(null)} className="px-4 py-2 rounded-xl bg-slate-200">
                        <Text className="text-slate-700">Ulangi Foto</Text>
                      </Pressable>
                    </>
                  ) : (
                    <>
                      <Text className="text-4xl text-slate-400 mb-3">📷</Text>
                      <Pressable onPress={takePhoto} className="px-5 py-2 rounded-xl bg-emerald-700">
                        <Text className="text-white font-roboto">Ambil Foto</Text>
                      </Pressable>
                    </>
                  )}
                </View>
              </View>

              {/* Lokasi (berbasis jarak, bukan accuracy) */}
              <View className={`mt-4 rounded-2xl border ${toneCardBorder} ${toneCardBg} p-4`}>
                <View className="flex-row items-start">
                  <View className={`h-3 w-3 rounded-full ${dotColor} mt-1 mr-3`} />
                  <View className="flex-1">
                    <Text className="font-poppins-medium text-slate-800">{titleText}</Text>
                    <Text className="text-slate-500 mt-0.5">{locationName ?? "-"}</Text>

                    {coords && (
                      <Text className="text-slate-400 mt-1">
                        Lat: {coords.latitude.toFixed(5)} | Lon: {coords.longitude.toFixed(5)}
                        {showDistance != null && showRadius != null
                          ? ` | Jarak: ${Math.round(showDistance)}m / Radius: ${Math.round(showRadius)}m`
                          : ""}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {!!error && <Text className="text-red-500 mt-2">{error}</Text>}
            </View>

            {/* Tombol aksi bawah */}
            <View className="px-4 pb-4 mt-3">
              <Pressable
                onPress={handleConfirmPress}
                disabled={loading || !photoUri}
                className={`h-12 rounded-2xl items-center justify-center ${
                  loading || !photoUri ? "bg-slate-300" : tone.pillBg
                }`}
              >
                <Text className="text-white font-poppins-semibold">
                  {loading ? "Menyimpan..." : variant === "in" ? "MASUK" : "KELUAR"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
