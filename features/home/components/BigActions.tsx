// app/(home)/sections/BigActions.tsx
import { useDetectedLocation } from "@/shared/hooks/useDetectedLocation";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import CircleIcon from "../components/CircleIcon";
import ModalAttendance from "../components/ModalAttendance";
import Section from "../components/Section";

type OpenState = null | "in" | "out";

export default function BigActions({
  className = "",
  token,
  simulateLocationError = false,
  onCheckIn,
  onCheckOut,
  onConfirmIn,
  onConfirmOut,
}: {
  className?: string;
  token: string;
  simulateLocationError?: boolean;   // ✅ betulkan: harus boolean
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  onConfirmIn?: () => void;
  onConfirmOut?: () => void;
}) {
  const [open, setOpen] = useState<OpenState>(null);
  const { locationName, loading, error } = useDetectedLocation({
    simulateError: simulateLocationError,
  });

  const resolvedLocationName =
    loading ? "Mendeteksi lokasi…" : error ? error : locationName ?? "Lokasi tidak tersedia";

  return (
    <Section className={className} style={{ elevation: 8 }}>
      <View className="flex-row gap-4">
        <Pressable
          onPress={() => setOpen("in")}
          className="flex-1 bg-emerald-50 rounded-xl p-4 border border-emerald-100"
        >
          <View className="items-center">
            <CircleIcon name="access-time" bg="#10b981" />
            <Text className="mt-2 font-roboto-medium text-emerald-700">Masuk</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => setOpen("out")}
          className="flex-1 bg-rose-50 rounded-xl p-4 border border-rose-100"
        >
          <View className="items-center">
            <CircleIcon name="access-time" bg="#ef4444" />
            <Text className="mt-2 font-roboto-medium text-rose-700">Keluar</Text>
          </View>
        </Pressable>
      </View>

      <ModalAttendance
        visible={open === "in"}
        onClose={() => setOpen(null)}
        onConfirm={() => setOpen(null)}
        variant="in"
        locationName={resolvedLocationName}
        token={token}
      />
      <ModalAttendance
        visible={open === "out"}
        onClose={() => setOpen(null)}
        onConfirm={() => setOpen(null)}
        variant="out"
        locationName={resolvedLocationName}
        token={token}
      />
    </Section>
  );
}
