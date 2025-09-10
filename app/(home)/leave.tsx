import { View, Text } from "react-native";

export default function IzinCutiPage() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-base font-roboto text-slate-800">Izin / Cuti</Text>
      <Text className="text-[12px] text-slate-600 mt-1">
        Halaman pengajuan izin/cuti. (jenis, tanggal, alasan, lampiran)
      </Text>
    </View>
  );
}
