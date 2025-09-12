import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

type PageProps = {
  title: string;
  scroll?: boolean;
  keyboard?: boolean;
  showBackButton?: boolean;
  children: React.ReactNode;
};

export default function Page({
  title,
  scroll = true,
  keyboard = false,
  children,
}: PageProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const Header = (
    <View
      className="bg-emerald-600 px-5 pb-6 rounded-b-3xl"
      style={{ paddingTop: insets.top + 12 }}
    >
      <View className="flex-row items-center pt-2 justify-between">
        <View>
          <Text className="text-white text-2xl font-roboto-bold">{title}</Text>
        </View>
          <Pressable
            className="h-9 w-9 rounded-full items-center justify-center active:bg-white/10"
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <MaterialIcons name="arrow-back" size={22} color="#ffff" />
          </Pressable>
      </View>
    </View>
  );

  const Body = scroll ? (
    <ScrollView
      className="flex-1 mt-5"
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1 px-4 pb-4">{children}</View>
  );

  const Inner = keyboard ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {Header}
      {Body}
    </KeyboardAvoidingView>
  ) : (
    <>
      {Header}
      {Body}
    </>
  );

  return <SafeAreaView className="flex-1 bg-gray-100">{Inner}</SafeAreaView>;
}
