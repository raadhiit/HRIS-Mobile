// app/(home)/sections/Section.tsx
import React from "react";
import { View, Text, ViewStyle } from "react-native";

export default function Section({
  title,
  children,
  className = "",
  style,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}) {
  return (
    <View
      className={`mx-5 my-2 bg-white rounded-2xl p-4 border border-slate-300 shadow ${className}`}
      style={style}
    >
      {title ? (
        <Text className="font-poppins-medium text-xl text-blue-900 mb-3">
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
