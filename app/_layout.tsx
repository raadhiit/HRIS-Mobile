import { AuthProvider } from "@/shared/context/AuthProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Text, useColorScheme, View } from "react-native";
import Toast from "react-native-toast-message";
import "../global.css";

import {
  Roboto_400Regular, Roboto_500Medium, Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import {
  Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold,
} from "@expo-google-fonts/poppins";


// tahan splash sampai font siap
SplashScreen.preventAutoHideAsync();

const MyToast = ({ text1, text2, type }: { text1?: string; text2?: string; type?: string }) => {
  const bg =
    type === "success" ? "bg-emerald-600"
    : type === "error"   ? "bg-rose-600"
    : "bg-slate-900/95";

  return (
    <View className={`mx-4 rounded-2xl px-4 py-3 ${bg}`}>
      {!!text1 && <Text className="text-white font-semibold text-base">{text1}</Text>}
      {!!text2 && <Text className="text-white/90 text-sm mt-0.5">{text2}</Text>}
    </View>
  );
};

// ✅ Mapping type -> komponen
const toastConfig = {
  success: (props: any) => <MyToast {...props} />,
  error:   (props: any) => <MyToast {...props} />,
  info:    (props: any) => <MyToast {...props} />,
};


export default function RootLayout() {
  const scheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(scheme === "dark" ? "#000" : "#fff");

    if (fontsLoaded) {
      SplashScreen.hideAsync(); // tutup splash kalau font sudah siap
    }
  }, [scheme, fontsLoaded]);

  if (!fontsLoaded) {
    return null; // biarkan splash tetap tampil
  }

  return (
    <AuthProvider>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
      <Toast
        config={toastConfig}
        position="top"
        visibilityTime={2200}
      />
    </AuthProvider>
  );
}
