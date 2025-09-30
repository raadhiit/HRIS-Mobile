import {
  View,
  Text,
  ScrollView,
  Pressable
} from "react-native";
import Page from "@/features/home/layouts/Page";
import Input from "@/shared/ui/input";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
// import { mockHome } from "@/shared/api/mocks";
import LeaveTypeDropdown from "@/features/home/components/ApiDropdown";
import Toast from "react-native-toast-message";

// dev
import { submitLeave } from "@/shared/api/leave";

export default function LeavePage() {
  const initialForm = { leaveType: null as string | null, start: "", end: "", reason: "", subtitute: "" };
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof typeof form) => (v:string) => setForm((s) => ({ ...s, [k]: v }));

  // const sisaCuti = mockHome.stats.find(s => s.label.toLowerCase().includes("sisa cuti"))?.value ?? 0;

  const invalid =
    !form.leaveType || !form.start || !form.end || !form.reason || !form.subtitute;

  const doSubmit = async () => {
    setSubmitted(true);
    if (invalid) {
      Toast.show({ 
        type: "error", 
        text1: "Form belum lengkap", 
        text2: "Lengkapi semua field wajib." 
      });
      return;
    }

    try {
      setLoading(true);
      const res = await submitLeave(form);
      if (res.status === "success") {
        Toast.show({ 
          type: "success", 
          text1: "Berhasil", 
          text2: res.message ?? "Pengajuan berhasil (dummy).",
        });
        setForm(initialForm);
        setSubmitted(false); // << penting: trigger useEffect di Input untuk reset touched
      } else {
        Toast.show({ 
          type: "error", 
          text1: "Gagal", 
          text2: res.message ?? "Pengajuan gagal (dummy)." ,
        });
      }
    } catch (e: any) {
      Toast.show({ 
        type: "error", 
        text1: "Gagal", 
        text2: e?.message ?? "Pengajuan gagal (dummy)." ,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
      title="Izin/Cuti"
      keyboard
    >
      <ScrollView className="flex-1" contentContainerStyle={{ gap: 12 }}>
        <View className="rounded-xl bg-white p-5 border border-gray-200 shadow mb-2">
          <View className="flex-row items-center justify-between">
            {/* kiri: user + role */}
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 rounded-full bg-emerald-100 items-center justify-center">
                <MaterialIcons name="person" size={20} color="#059669" />
              </View>
              <View>
                <Text className="text-black font-poppins-medium text-base">
                  {/* {mockHome.user.username} */}
                </Text>
                {/* <Text className="text-slate-500 text-sm">{mockHome.user.role}</Text> */}
              </View>
            </View>

            {/* kanan: sisa cuti */}
            <View className="items-end">
              <Text className="text-slate-500 text-xs">Sisa Cuti</Text>
              <View className="flex-row items-baseline">
                <Text className="text-emerald-600 font-roboto-bold text-2xl">
                  {/* {sisaCuti} */}
                </Text>
                <Text className="text-slate-500 ml-1">hari</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="rounded-xl bg-white p-5 border border-gray-200 shadow">
          <Text className="font-poppins-medium text-xl text-black pb-5">
            FORM PENGAJUAN CUTI/IZIN
          </Text>

          <LeaveTypeDropdown
            value={form.leaveType}
            onChange={set("leaveType")}
            label="Jenis Cuti/Izin"
            placeholder="Pilih jenis"
          />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input
                label="Tangal Mulai"
                type="date"
                placeholder="YYYY-MM-DD"
                value={form.start}
                onChangeText={set("start")}
                left={<MaterialIcons name="event" size={18} color="#64748b" />}
                required
                submitted={submitted}
                requiredMessage="Tanggal mulai harus diisi!"
              />
            </View>
            <View className="flex-1">
              <Input
                label="Tanggal Selesai"
                type="date"
                placeholder="YYYY-MM-DD"
                value={form.end}
                onChangeText={set("end")}
                left={<MaterialIcons name="event" size={18} color="#64748b" />}
                required
                submitted={submitted}
                requiredMessage="Tanggal selesai harus diisi!"
              />
            </View>
          </View>
          <Input 
            label="Pengganti"
            type="text"
            placeholder="Pengganti"
            value={form.subtitute}
            onChangeText={set("subtitute")}
            required
            submitted={submitted}
            requiredMessage="Pengganti harus diisi"
          />
          <Input
            label="Alasan"
            type="textarea"
            placeholder="Tulis alasan lembur"
            value={form.reason}
            onChangeText={set("reason")}
            required
            submitted={submitted}
            requiredMessage="Alasan harus diisi!"
          />

          <View className="gap-2 mt-4">
            <Pressable 
              className="rounded-2xl bg-emerald-600 py-3 items-center"
              onPress={doSubmit}
            >
              <Text className="text-white font-roboto">Ajukan Cuti/Izin</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}
