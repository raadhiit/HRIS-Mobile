// components/ModalAttendance.tsx
import { useAttendanceCamera } from "@/shared/hooks/useAttendanceCamera";
import { formatJamID, formatTanggalID } from "@/shared/utils/datetime";
import React from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";

type Variant = "in" | "out";

export interface ModalAttendanceProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void; // dipanggil setelah submit sukses (opsional di parent)
  variant: Variant;
  locationName?: string;
  token: string; // auth untuk upload
}

export default function ModalAttendance({
  visible,
  onClose,
  onConfirm,
  variant,
  locationName = "RS Harapan Mulia",
  token,
}: ModalAttendanceProps) {
  const now = new Date();
  const title = variant === "in" ? "Masuk" : "Keluar";
  const tone = {
    cardBg: variant === "in" ? "bg-emerald-50" : "bg-rose-50",
    cardBorder: variant === "in" ? "border-emerald-100" : "border-rose-100",
    timeTxt: variant === "in" ? "text-emerald-700" : "text-rose-700",
    pillBg: variant === "in" ? "bg-emerald-500" : "bg-rose-500",
  };

  const { photoUri, takePhoto, submit, loading, error, setPhotoUri } = useAttendanceCamera(token);

  const handleConfirmPress = async () => {
    const action = variant === "in" ? "MASUK" : "KELUAR";
    const stamp = `${now.toDateString()} ${now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}`;
    console.log(`[ModalAttendance] Aksi: ${action} pada ${stamp}`);

    // kirim ke API (kamu bisa kirim metadata tambahan di extra)
    const resp = await submit(variant, { locationName });
    if (resp) {
      onConfirm?.();
      onClose();
      // reset preview jika mau:
      setPhotoUri(null);
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

              {/* Lokasi */}
              <View className={`mt-4 rounded-2xl border ${tone.cardBorder} ${tone.cardBg} p-4`}>
                <View className="flex-row items-start">
                  <View className="h-3 w-3 rounded-full bg-emerald-500 mt-1 mr-3" />
                  <View className="flex-1">
                    <Text className="font-poppins-medium text-slate-800">Lokasi Terdeteksi</Text>
                    <Text className="text-slate-500 mt-0.5">{locationName}</Text>
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
                className={`h-12 rounded-2xl items-center justify-center ${loading || !photoUri ? "bg-slate-300" : tone.pillBg}`}
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
