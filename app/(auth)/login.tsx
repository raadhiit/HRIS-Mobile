import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { loginRaw, setToken as saveToken } from "@/shared/api/prod/auth/auth_min";
import { useAuth } from "@/shared/providers/AuthProvider";
import { Button } from "@/shared/ui/button";
import ResponsiveLogo from "@/shared/ui/responsiveLogo";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [secure, setSecure] = useState(true);
    const LogoImage = require("../../assets/img/logo-harmul.png");
    const router = useRouter();
    const insets = useSafeAreaInsets();

  const { setToken } = useAuth();

  const onLoginAndPost = async () => {
    if (!username.trim() || !password) {
      Toast.show({
        type: "warning",
        text1: "Lengkapi data",
        text2: "Username dan password wajib diisi.",
      });
      return;
    }

    setLoading(true);
    try {
        const ok = await loginRaw(username, password, "mobile");
        await saveToken(ok.data.token);
        await setToken(ok.data.token);
        router.replace("/(home)");
        Toast.show({
            type: "success",
            text1: "Login Berhasil!",
        });
    } catch(e: any) {
        Toast.show({
            type: "error",
            text1: "Login gagal",
            text2: e.message || "Username atau password salah.",
        });
    } finally {
        setLoading(false);
    }
  };

    return (
        <SafeAreaView className="flex-1 bg-white/50">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 24}
                className="flex-1"
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1 }} 
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 items-center justify-start px-8 pt-20 pb-6 gap-y-6">
                        <View className="w-full items-center">
                            <ResponsiveLogo 
                                source={LogoImage}
                                maxWidth={420}
                                widthPct={0.7}
                                accessibilityLabel="Logo HRIS RSHM"
                                borderRadius={12}
                            />
                            <Text className="text-4xl font-roboto-medium tracking-wide mt-6">
                                HRIS RSHM
                            </Text>
                        </View>
                         <View className="w-full mt-6 gap-y-2">
                            <View className="bg-white rounded-2xl px-4 py-2 border border-gray-200 shadow-lg">
                                <TextInput
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholder="username..."
                                    placeholderTextColor="#9ca3af"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    className="text-base text-black"
                                    style={{ fontFamily: "Roboto_400Regular" }}
                                    returnKeyType="next"
                                />
                            </View>

                            <View className="bg-white rounded-2xl px-4 py-2 border border-gray-200 shadow-lg">
                                <View className="flex-row items-center">
                                    <TextInput
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="password..."
                                        placeholderTextColor="#9ca3af"
                                        secureTextEntry={secure}
                                        className="flex-1 text-base text-black"
                                        style={{ fontFamily: "Roboto_400Regular" }}
                                        returnKeyType="done"
                                    />
                                    <Pressable
                                        onPress={() => setSecure((s) => !s)}
                                        hitSlop={10}
                                        className="px-2 py-1"
                                    >
                                        <Text className="text-xs text-gray-500 font-roboto">
                                            {secure ? "Show" : "Hide"}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                            <Button
                                title="Login"
                                variant="success"
                                className="mt-5"
                                autoLoading
                                minLoadingMs={1200}
                                onPress={onLoginAndPost}
                            />

                            <Pressable
                                className="mt-4 items-center justify-center"
                            >
                                <Text className="text-gray-500 text-sm justify-center">
                                    Forgot You're Password?
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    <View className="items-center py-3">
                        <Text className="text-xs text-gray-500">© 2025 | Developed by IT RSHM</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}