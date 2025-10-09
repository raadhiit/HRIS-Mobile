// app/(home)/profile.tsx
import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { useEmployeeProfile } from "@/shared/employee/hooks/userEmployees";
import { useAuth } from "@/shared/providers/AuthProvider";
import { Button } from "@/shared/ui/button";
import ConfirmSheet from "@/shared/ui/confirmSheet";

export default function ProfileScreen() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: emp, loading, ready, loggedIn, refresh } = useEmployeeProfile();
  const { logout } = useAuth();

  const doLogout = async () => {
    try {
      await logout();
      Toast.show({ 
        type: "info", 
        text1: "Logout berhasil",
        text1Style: { fontFamily: "Poppins_600SemiBold", fontSize: 14 }, 
      });
    } finally {
    }
  };

  const doRefresh = async () => {
    try {
      await refresh();
      Toast.show({ 
        type: "success", 
        text1: "Profil berhasil diperbarui",
        text1Style: { fontFamily: "Poppins_600SemiBold", fontSize: 16 }, 
      });
    } finally {
      setOpen(false);
    }
  }

  if (!ready) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator />
        <Text className="text-gray-500 mt-2">Menyiapkan data…</Text>
      </SafeAreaView>
    );
  }

  // ✅ Gunakan Redirect, bukan router.replace di render
  if (!loggedIn) return <Redirect href="/(auth)/login" />;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator />
        <Text className="text-gray-500 mt-2">Memuat profil…</Text>
      </SafeAreaView>
    );
  }

  if (!emp) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <MaterialIcons name="person-off" size={40} color="#6b7280" />
        <Text className="text-lg font-semibold mt-3">Profil tidak tersedia</Text>
        <Text className="text-gray-500 mt-1 text-center">
          Silakan login kembali.
        </Text>
        <Button
          title="Ke Halaman Login"
          variant="primary"
          className="mt-4"
          onPress={() => router.replace("/(auth)/login")}
        />
      </SafeAreaView>
    );
  }

  const fullName =
    emp.full_name || `${emp.first_name ?? ""} ${emp.last_name ?? ""}`.trim();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 px-5 pt-10 pb-6 rounded-b-3xl">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-xl font-semibold">Profile</Text>
          <Pressable
            className="h-9 w-9 rounded-full items-center justify-center active:bg-white/10"
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={22} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-white rounded-3xl p-5 shadow-lg border border-black/5">
          {/* Avatar */}
          <View className="items-center">
            <View className="h-24 w-24 rounded-full bg-blue-600 items-center justify-center shadow-md">
              <MaterialIcons name="person" size={56} color="#fff" />
            </View>

            <Text className="text-2xl font-semibold mt-4">{fullName}</Text>

            {(emp.position?.name || emp.department?.name) ? (
              <Text className="text-blue-700 font-medium italic mt-1">
                {[emp.position?.name, emp.department?.name].filter(Boolean).join(" • ")}
              </Text>
            ) : null}
          </View>

          {/* Info grid */}
          <View className="mt-6 rounded-2xl border border-gray-100 overflow-hidden">
            <View className="flex-row">
              <View className="flex-1 p-4 bg-gray-50">
                <Text className="text-xs uppercase tracking-wide text-gray-500">Kode Karyawan</Text>
                <Text className="mt-1 text-gray-900">{emp.employee_code ?? "-"}</Text>
              </View>
              <View className="w-px bg-gray-100" />
              <View className="flex-1 p-4 bg-gray-50">
                <Text className="text-xs uppercase tracking-wide text-gray-500">Tanggal Masuk</Text>
                <Text className="mt-1 text-gray-900">{emp.hire_date ?? "-"}</Text>
              </View>
            </View>

            <View className="h-px bg-gray-100" />

            <View className="flex-row">
              <View className="flex-1 p-4 bg-gray-50">
                <Text className="text-xs uppercase tracking-wide text-gray-500">Lokasi Kerja</Text>
                <Text className="mt-1 text-gray-900">{emp.work_location?.name ?? "-"}</Text>
              </View>
              <View className="w-px bg-gray-100" />
              <View className="flex-1 p-4 bg-gray-50">
                <Text className="text-xs uppercase tracking-wide text-gray-500">Jarak Rumah–Kantor</Text>
                <Text className="mt-1 text-gray-900">
                  {emp.distance_home_to_office_km ? `${emp.distance_home_to_office_km} km` : "-"}
                </Text>
              </View>
            </View>
          </View>

          {/* Aksi */}
          <View className="mt-6">
            <Button title="Logout" variant="destructive" className="mt-2" onPress={() => setOpen(true)} />
            <Button
              title="Refresh Profil"
              variant="secondary"
              className="mt-2"
              onPress={doRefresh}
            />
          </View>
        </View>

        <View className="mt-6 items-center">
          <Text className="text-sm text-gray-400 text-center">© 2025 | Developed by IT RSHM</Text>
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={open}
        title="Logout"
        message="Keluar dari akun ini?"
        confirmText="Logout"
        cancelText="Batal"
        destructive
        onConfirm={doLogout}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
}
