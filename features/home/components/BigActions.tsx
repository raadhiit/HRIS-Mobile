// app/(home)/sections/BigActions.tsx
import { useDetectedLocation } from "@/shared/hooks/attendance/useDetectedLocation";
import { useAuth } from "@/shared/providers/AuthProvider";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import CircleIcon from "../components/CircleIcon";
import ModalAttendance from "../components/ModalAttendance";
import Section from "../components/Section";

type OpenState = null | "in" | "out";

export default function BigActions(props: {
  className?: string;
  token: string;
  simulateLocationError?: boolean;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  onConfirmIn?: () => void;
  onConfirmOut?: () => void;
}) {
  const { className = "", token, simulateLocationError = false, onCheckIn, onCheckOut, onConfirmIn, onConfirmOut } = props;

  const [open, setOpen] = useState<OpenState>(null);

  const { locationName, coords, loading, error, refresh } = useDetectedLocation({
    simulateError: simulateLocationError,
    alwaysRequestOnMount: false,
    resolveName: false,
  });

  const { user, employee } = useAuth() as any;
  const userId = employee?.user_id ?? user?.id ?? null;

  const resolvedLocationName =
    loading ? "Mendeteksi lokasi…" : error ? error : (locationName?.trim().length ? "Lokasi Tidak Terdeteksi" : "Lokasi diketahui");

  return (
    <Section className={className} style={{ elevation: 8 }}>
      {/* tombol */}
      <View className="flex-row gap-4">
        <Pressable
          onPress={() => {
            refresh();
            setOpen("in");
            onCheckIn?.();
          }}
          className="flex-1 bg-emerald-50 rounded-xl p-4 border border-emerald-100"
        >
          <View className="items-center">
            <CircleIcon name="access-time" bg="#10b981" />
            <Text className="mt-2 font-roboto-medium text-emerald-700">Masuk</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            refresh();
            setOpen("out");
            onCheckOut?.();
          }}
          className="flex-1 bg-rose-50 rounded-xl p-4 border border-rose-100"
        >
          <View className="items-center">
            <CircleIcon name="access-time" bg="#ef4444" />
            <Text className="mt-2 font-roboto-medium text-rose-700">Keluar</Text>
          </View>
        </Pressable>
      </View>

      {/* modal */}
      <ModalAttendance
        visible={open === "in"}
        onClose={() => setOpen(null)}
        onConfirm={() => { setOpen(null); onConfirmIn?.(); }}
        variant="in"
        locationName={resolvedLocationName}
        token={token}
        coords={coords}
        userId={userId}
      />
      <ModalAttendance
        visible={open === "out"}
        onClose={() => setOpen(null)}
        onConfirm={() => { setOpen(null); onConfirmOut?.(); }}
        variant="out"
        locationName={resolvedLocationName}
        token={token}
        coords={coords}
        userId={userId}
      />
    </Section>
  );
}
