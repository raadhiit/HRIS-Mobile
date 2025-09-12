import {
  View,
  Text,
  Pressable
} from "react-native";
import Page from "@/features/home/layouts/Page";
import Section from "@/features/home/components/Section";

export default function LeavePage() {
  return (
    <Page
      title="Ajukan Cuti/izin"
      subtitle="Setelah jam kerja"
      keyboard
      footer={
        <View className="gap-2">
          <Pressable className="rounded-2xl bg-emerald-600 py-3 items-center">
            <Text className="text-white font-roboto">Ajukan Cuti/Izin</Text>
          </Pressable>
          <Pressable className="rounded-2xl border border-emerald-200 bg-emerald-50 py-3 items-center">
            <Text className="text-emerald-700 font-roboto">Simpan Draft</Text>
          </Pressable>
        </View>
      }
    >
      <Section
        title="Tanggal & Waktu"
        children={
          <Text className="text-[12px] text-slate-600">
            (Taruh form tanggal & waktu di sini…)
          </Text>
        }
      >
      </Section>
    </Page>
  );
}
