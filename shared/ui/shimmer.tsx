import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Shimmer({
  style,
  width = "100%",              // ✅ default string persentase masih oke
  height = 16,
  borderRadius = 12,
}: {
  style?: StyleProp<ViewStyle>;
  // ✅ batasi ke tipe yang valid untuk Animated.View
  width?: number | `${number}%` | "auto";
  height?: number;
  borderRadius?: number;
}) {
  const translateX = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translateX, {
        toValue: 400,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [translateX]);

  return (
    <Animated.View
      style={[
        {
          overflow: "hidden",
          backgroundColor: "#e5e7eb",
          width,                  // ✅ sekarang tipenya cocok
          height,
          borderRadius,
        } as ViewStyle,           // (opsional) hilangkan noise tipe dari Animated
        style,
      ]}
    >
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 200,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.6)", "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </Animated.View>
  );
}
