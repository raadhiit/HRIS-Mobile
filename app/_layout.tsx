import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/shared/providers/AuthProvider';
import { useFonts } from "expo-font";
import { Stack, useSegments, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from '@/shared/ui/toastConfig';
import "../global.css";
import {
  Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  Roboto_400Regular, Roboto_500Medium, Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

// function AuthGate({ children }: { children: React.ReactNode }) {
//   const segments = useSegments();
//   const router = useRouter();
//   const { token, hydrated } = useAuth();

//   // Jalankan sekali saat hydrated berubah → putuskan akses
//   useEffect(() => {
//     if (!hydrated) return;

//     const inAuth = segments[0] === "(auth)";
//     const inHome = segments[0] === "(home)";

//     if (!token && !inAuth) {
//       router.replace("/(auth)/login");
//     } else if (token && inAuth) {
//       router.replace("/(home)");
//     }
//     // kalau token & inHome → biarkan
//   }, [segments, token, hydrated]);

//   // Tahan UI sampai hydrated supaya tidak lompat-lompat
//   if (!hydrated) return null;
//   return <>{children}</>;
// }

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
    SystemUI.setBackgroundColorAsync("transparent");
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [scheme, fontsLoaded]);

  if (!fontsLoaded) return null; 

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <SafeAreaView 
          style={{ flex: 1, backgroundColor: scheme === "dark" ? "#000" : "#fff" }}
          edges={['left','right','bottom']}
        >
          <StatusBar
            style={scheme === "dark" ? "light" : "dark"}
            backgroundColor="transparent"
            translucent
          />
          <Stack screenOptions={{ headerShown: false }} />
          <Toast
            config={toastConfig}
            visibilityTime={2200}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
