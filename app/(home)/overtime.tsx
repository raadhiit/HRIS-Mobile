import { View, Text, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import Page from "@/features/home/layouts/Page";
import Input from "@/shared/ui/input";
import { MaterialIcons } from "@expo/vector-icons";
import { History } from "@/shared/api/types";
import { mockHome } from "@/shared/api/mocks";

export default function LemburPage() {
  const [form, setForm] = useState({
    date: "",
    start: "17:00",
    end: "",
    reason: "",
    note: "",
  });
  
  const set = (k: keyof typeof form) => (v:string) => setForm((s) => ({ ...s, [k]: v }));

  const history: History[] = mockHome.history?? [];

  const doSubmit = () => {
    console.log("OVERTIME SUBMIT", form);
  };

 return (
    <Page title="Lembur" keyboard>
      <ScrollView className="flex-1" contentContainerStyle={{ gap: 12 }}>
        <View className="rounded-xl bg-white p-5 border border-gray-200 shadow">
          <Text
            className="font-poppins-medium text-xl text-black"
          > 
            Form Pengajuan Lembur
          </Text>
          <Input
            label="Tanggal"
            type="date"
            placeholder="YYYY-MM-DD"
            value={form.date}
            onChangeText={set("date")}
            left={<MaterialIcons name="event" size={18} color="#64748b" />}
          />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input
                label="Mulai"
                type="time"
                placeholder="HH:MM"
                value={form.start}
                onChangeText={set("start")}
                left={<MaterialIcons name="schedule" size={18} color="#64748b" />}
              />
            </View>
            <View className="flex-1">
              <Input
                label="Selesai"
                type="time"
                placeholder="HH:MM"
                value={form.end}
                onChangeText={set("end")}
                left={<MaterialIcons name="schedule" size={18} color="#64748b" />}
              />
            </View>
          </View>
          <Input
            label="Alasan"
            type="textarea"
            placeholder="Tulis alasan lembur"
            value={form.reason}
            onChangeText={set("reason")}
          />

          <View className="gap-2 mt-2">
            <Pressable 
              className="rounded-2xl bg-emerald-600 py-3 items-center"
              onPress={doSubmit}
            >
              <Text className="text-white font-roboto">Ajukan Lembur</Text>
            </Pressable>
          </View>
        </View>

        <View
          className="bg-white rounded-xl shadow border border-gray-200 p-4 "
        >
          <Text className="font-poppins-medium text-black text-xl">
            Riwayat Lembur
          </Text>

         {history.map((h, i) => (
            <View key={i} className="flex-row items-center gap-3 py-2">
              <View className={`w-8 h-8 rounded-full items-center justify-center ${
                h.status === "approved" ? "bg-emerald-100"
                : h.status === "rejected" ? "bg-rose-100"
                : "bg-amber-100"
              }`}>
                <MaterialIcons
                  name="event"
                  size={18}
                  color={
                    h.status === "approved" ? "#22C55E"
                    : h.status === "rejected" ? "#F43F5E"
                    : "#F59E0B"
                  }
                />
              </View>

              <View className="flex-1">
                <Text className="font-poppins-medium text-gray-500">{h.date}</Text>
                <Text className={`text-xs font-roboto ${
                  h.status === "approved" ? "text-emerald-700"
                  : h.status === "rejected" ? "text-rose-700"
                  : "text-amber-700"
                }`}>
                  {h.status === "approved" ? "Disetujui"
                  : h.status === "rejected" ? "Ditolak"
                  : "Menunggu"}
                </Text>
              </View>
            </View>
          ))}

        </View>

      </ScrollView>
    </Page>
  );
}
