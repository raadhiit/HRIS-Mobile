import { me } from "@/shared/api/auth";
import { Redirect, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";


export default function HomeLayout() {
  const [status, setStatus] = useState<"loading" | "ok" | "no">("loading");

  useEffect(() => {
    let alive = true;
    (async () => {
      try{
        await me();
        if (alive) setStatus("ok");
      } catch {
        if(alive) setStatus("no");
      }
    })();
    return () => { alive = false; };
  });

  if (status === "loading") {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (status === "no") {
    return <Redirect href="/(auth)/login" />;
  }
  
  return <Stack screenOptions={{ headerShown: false }} />;
}
