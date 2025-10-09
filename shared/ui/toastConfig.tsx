// shared/ui/toastConfig.tsx
import React from "react";
import { Text, View } from "react-native";

/** Palet pastel sederhana */
const pastel = {
  success: {
    bg: "#ECFDF5",      // emerald-50
    border: "#BBF7D0",  // emerald-200
    title: "#065F46",   // emerald-800
    body: "#047857",    // emerald-700
  },
  error: {
    bg: "#FEF2F2",      // rose-50
    border: "#FECACA",  // rose-200
    title: "#9F1239",   // rose-800
    body: "#BE123C",    // rose-700
  },
  info: {
    bg: "#EFF6FF",      // blue-50
    border: "#BFDBFE",  // blue-200
    title: "#1E3A8A",   // blue-900
    body: "#1D4ED8",    // blue-700
  },
  in: {
    bg: "#ECFDF5",
    border: "#BBF7D0",
    title: "#065F46",
    body: "#047857",
  },
  out: {
    bg: "#FEF2F2",
    border: "#FECACA",
    title: "#9F1239",
    body: "#BE123C",
  },
  warning: { 
    bg: "#FFF7ED", // orange-50 
    border: "#FED7AA", // orange-200 
    title: "#9A3412", // orange-800 
    body: "#C2410C", 
}
} as const;

/** Komponen toast pastel generik */
function PastelToast({
  title,
  subtitle,
  palette,
}: {
  title: string;
  subtitle?: string | null;
  palette: (typeof pastel)[keyof typeof pastel];
}) {
  return (
    <View style={{ alignSelf: "center", width: "92%" }} className="mt-2">
      <View
        style={{ backgroundColor: palette.bg, borderColor: palette.border }}
        className="relative rounded-2xl border px-4 py-3"
      >
        <Text
          style={{ color: palette.title, fontFamily: "Poppins_600SemiBold" }}
          className="text-[16px] leading-tight"
          numberOfLines={2}
        >
          {title}
        </Text>
        {!!subtitle && (
          <Text
            style={{ color: palette.body, fontFamily: "Roboto_400Regular" }}
            className="mt-1 text-[14px]"
            numberOfLines={3}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}

export const toastConfig = {
  /** Global success */
  success: ({ text1, text2 }: any) => (
    <PastelToast title={text1 ?? "Berhasil"} subtitle={text2} palette={pastel.success} />
  ),

  /** Global error */
  error: ({ text1, text2 }: any) => (
    <PastelToast title={text1 ?? "Terjadi kesalahan"} subtitle={text2} palette={pastel.error} />
  ),

  warning: ({ text1, text2}: any) => (
    <PastelToast title={text1 ?? "Peringatan"} subtitle={text2} palette={pastel.warning} />
  ),

  /** Global info */
  info: ({ text1, text2 }: any) => (
    <PastelToast title={text1 ?? "Info"} subtitle={text2} palette={pastel.info} />
  ),

  /** Khusus attendance (pakai props: { variant: "in"|"out", timeStr, location }) */
  attendanceSuccess: ({ props }: any) => {
    const { variant, timeStr, location } = props ?? {};
    const isIn = variant === "in";
    const title = isIn ? "Check-in berhasil" : "Check-out berhasil";
    const subtitle = [timeStr, location].filter(Boolean).join(" • ");
    const palette = isIn ? pastel.info : pastel.out;

    return <PastelToast title={title} subtitle={subtitle} palette={palette} />;
  },
};
