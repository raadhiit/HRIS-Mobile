// app/(auth)/2fa.tsx
import { useAuth } from "@/shared/context/AuthProvider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function TwoFA() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { verify2FA } = useAuth();
  const router = useRouter();

  const onVerify = async () => {
    if (otp.trim().length < 6) {
      Alert.alert("2FA", "Masukkan 6 digit OTP.");
      return;
    }
    setLoading(true);
    try {
      await verify2FA(otp.trim());
      router.replace("/(home)");
    } catch (e: any) {
      Alert.alert("OTP salah", e?.message || "Gagal verifikasi 2FA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-6 items-center justify-center bg-white">
      <Text className="text-2xl font-bold mb-4">Masukkan Kode 2FA</Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        placeholder="6-digit code"
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 mb-3"
        maxLength={6}
      />
      <Pressable
        disabled={loading || otp.trim().length < 6}
        onPress={onVerify}
        className={`rounded-2xl px-4 py-3 w-full items-center ${
          loading || otp.trim().length < 6 ? "bg-gray-300" : "bg-emerald-500"
        }`}
      >
        <Text className="text-white font-semibold">
          {loading ? "Memverifikasi..." : "Verify"}
        </Text>
      </Pressable>
    </View>
  );
}
