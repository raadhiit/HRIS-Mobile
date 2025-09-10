import { useAuth } from "@/shared/context/AuthProvider";
import { Button } from "@/shared/ui/button";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secure, setSecure] = useState(true);
    const LogoImage = require("../../assets/img/logo-harmul.png");
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { login } = useAuth();

    const onLogin = async () => {
        if (!email.trim() || !password) {
            Toast.show({
                type: "info",
                text1: "Lengkapi data",
                text2: "Email dan password wajib diisi.",
            });
            return;
        }

        try {
            const result = await login({
                email: email.trim().toLowerCase(),
                password,
            });

            if (result === "2fa_required") {
                Toast.show({
                    type: "success",
                    text1: "Kode OTP dikirim",
                    text2: "Silakan verifikasi terlebih dulu.",
                });
                router.push("/auth/otp" as any);
            } else {
                Toast.show({
                    type: "success",
                    text1: "Login berhasil",
                    text2: "Mengalihkan ke beranda…",
                });
                router.replace("/(home)");
            }
        } catch (e: any) {
            Toast.show({
                type: "error",
                text1: "Login gagal",
                text2: e?.message || "Terjadi kesalahan.",
            });
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
                            <Image 
                                source={LogoImage} 
                                className="h-48 w-64"
                                resizeMode="contain"
                            />
                            <Text className="text-4xl font-roboto-medium tracking-wide mt-6">
                                HRIS RSHM
                            </Text>
                        </View>
                         <View className="w-full mt-6 gap-y-2">
                            <View className="bg-white rounded-2xl px-4 py-2 border border-gray-200 shadow-lg">
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="email..."
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
                                onPress={onLogin}
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