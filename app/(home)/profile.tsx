import { useAuth } from "@/shared/context/AuthProvider";
import { Button } from "@/shared/ui/button";
import ConfirmSheet from "@/shared/ui/confirmSheet";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from "react-native";

export default function ProfileScreen() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const doLogout = async () => {
    await logout();
    router.replace("/(auth)/login" as any);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator />
        <Text className="text-gray-500 mt-2">Memuat profil…</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <MaterialIcons name="person-off" size={40} color="#6b7280" />
        <Text className="text-lg font-semibold mt-3">Belum masuk</Text>
        <Text className="text-gray-500 mt-1 text-center">
          Silakan login untuk melihat profil.
        </Text>
        <Button
          title="Ke Halaman Login"
          variant="primary"
          className="mt-4"
          onPress={() => router.replace("/auth/login" as any)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-emerald-600 px-5 pt-14 pb-6 rounded-b-3xl">
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
        {/* Card Profil Utama */}
        <View className="bg-white rounded-3xl p-5 shadow-lg border border-black/5">
          {/* Avatar */}
          <View className="items-center">
            <View className="h-24 w-24 rounded-full bg-emerald-600 items-center justify-center shadow-md">
              {/* Jika suatu saat punya avatar_url, ganti ini jadi <Image /> */}
              <MaterialIcons name="person" size={56} color="#fff" />
            </View>

            {/* Nama & Role */}
            <Text className="text-2xl font-semibold mt-4">{user.name}</Text>
            {user?.email ? (
              <Text className="text-gray-500 mt-1">{user.email}</Text>
            ) : null}
            {/* Kalau punya role di profil, tampilkan — untuk sekarang ambil dari mockHome di tempat lain;
                di sini kita contohkan "IT STAFF" kalau ada di user.role */}
            {"role" in user ? (
              // @ts-ignore (kalau tipe Profile belum punya role)
              <Text className="text-emerald-700 font-medium mt-1 italic">
                {/* @ts-ignore */}
                {user.role}
              </Text>
            ) : null}
          </View>

          {/* Info grid (contoh, bisa kamu sesuaikan) */}
          <View className="mt-6 rounded-2xl border border-gray-100 overflow-hidden">
            <View className="flex-row">
              <View className="flex-1 p-4 bg-gray-50">
                <Text className="text-xs uppercase tracking-wide text-gray-500">
                  Nama
                </Text>
                <Text className="mt-1 text-gray-900">{user.name}</Text>
              </View>
              <View className="w-px bg-gray-100" />
              <View className="flex-1 p-4 bg-gray-50">
                <Text className="text-xs uppercase tracking-wide text-gray-500">
                  Email
                </Text>
                <Text className="mt-1 text-gray-900">
                  {user?.email ?? "-"}
                </Text>
              </View>
            </View>
          </View>

          {/* Aksi */}
          <View className="mt-6">
            <Button
              title="Logout"
              variant="destructive"
              className="mt-2"
              onPress={() => setOpen(true)}
            />
          </View>
        </View>

        {/* Bagian lain (opsional) */}
        <View className="mt-6 items-center">
          <Text className="text-sm text-gray-400 text-center">
            © 2025 | Developed by IT RSHM
          </Text>
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
    </SafeAreaView>
  );
}
