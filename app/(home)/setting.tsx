import { View, Text } from "react-native";

export default function PengaturanPage() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-base font-roboto text-slate-800">Pengaturan</Text>
      <Text className="text-[12px] text-slate-600 mt-1">
        Preferensi tema, keamanan akun, notifikasi, dsb.
      </Text>
    </View>
  );
}
