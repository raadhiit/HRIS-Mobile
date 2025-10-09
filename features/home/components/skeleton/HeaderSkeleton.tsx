import React from "react";
import { View } from "react-native";
import Shimmer from "@/shared/ui/shimmer";

export default function HeaderSkeleton() {
    return (
        <View className="bg-blue-600 rounded-b-3xl px-5 pt-12 pb-4">
            <View className="flex-row justify-between items-start px-2 pb-4">
                <View>
                    <Shimmer height={24} width={100} style={{ backgroundColor: "rgba(255,255,255,0.25)" }}/>
                    <View className="h-2" />
                    <Shimmer height={18} width={140} style={{ backgroundColor: "rgba(255,255,255,0.25)" }} />
                    <View className="h-1.5" />
                    <Shimmer height={12} width={110} style={{ backgroundColor: "rgba(255,255,255,0.25)" }} />
                </View>
                <View className="flex-row gap-4 pt-4">
                    <Shimmer width={36} height={18} borderRadius={36} style={{ backgroundColor: "rgba(255,255,255,0.25)" }} />
                    <Shimmer width={36} height={18} borderRadius={36} style={{ backgroundColor: "rgba(255,255,255,0.25)" }} />
                </View>
            </View>
        </View>
    );
}