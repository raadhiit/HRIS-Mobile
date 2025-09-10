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
      className={`mx-5 my-3 bg-white rounded-2xl p-4 border border-gray-200 shadow ${className}`}
      style={style}
    >
      {title ? (
        <Text className="font-poppins-medium text-xl text-slate-800 mb-3">
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
