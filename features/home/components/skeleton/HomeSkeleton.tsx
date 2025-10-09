import React from "react";
import { View } from "react-native";
import Shimmer from "@/shared/ui/shimmer";

/** Mini tile skeleton yang meniru StatTile (badge + title + value) */
function SkeletonStatTile() {
  return (
    <View
      className="flex-1 mx-1 rounded-2xl border border-slate-200 bg-white p-3"
      style={{ elevation: 1 }}
    >
      {/* Header: badge + title */}
      <View className="flex-row items-center">
        {/* Badge netral (meniru slate-100 / #F1F5F9) */}
        <View
          className="items-center justify-center rounded-full"
          style={{ width: 30, height: 30, backgroundColor: "#F1F5F9" }}
        >
          {/* titik ikon */}
          <Shimmer width={18} height={18} borderRadius={9} />
        </View>
        <View className="ml-2">
          <Shimmer width={90} height={12} borderRadius={6} />
        </View>
      </View>

      {/* Nilai utama */}
      <View className="mt-2">
        <Shimmer width={80} height={18} borderRadius={6} />
      </View>
    </View>
  );
}

export default function HomeSkeleton() {
  return (
    <View className="px-5 pt-3 pb-4">
      {/* BigActions skeleton */}
      <View className="flex-row justify-between mb-5">
        <View className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 mx-1">
          <View className="items-center">
            <Shimmer width={56} height={56} borderRadius={28} />
            <View className="h-3" />
            <Shimmer width={"60%"} height={16} />
          </View>
        </View>
        <View className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 mx-1">
          <View className="items-center">
            <Shimmer width={56} height={56} borderRadius={28} />
            <View className="h-3" />
            <Shimmer width={"60%"} height={16} />
          </View>
        </View>
      </View>

      {/* Today Info skeleton */}
      <View className="rounded-2xl border border-slate-200 bg-white p-4 mb-5">
        <View className="flex-row items-center gap-3 mb-3">
          <Shimmer width={50} height={50} borderRadius={25} />
          <View className="flex-1">
            <Shimmer width={"70%"} height={16} borderRadius={6} />
            <View className="h-2" />
            <Shimmer width={"40%"} height={16} borderRadius={6} />
          </View>
        </View>
      </View>

      {/* MenuGrid skeleton */}
      <View className="rounded-2xl border border-slate-200 bg-white p-4">
        <Shimmer height={18} width={120} />
        <View className="h-4" />

        <View className="flex-row">
          <View className="flex-1 mx-1">
            <Shimmer width={90} height={90} borderRadius={20} />
          </View>
          <View className="flex-1 mx-1">
            <Shimmer width={90} height={90} borderRadius={20} />
          </View>
          <View className="flex-1 mx-1">
            <Shimmer width={90} height={90} borderRadius={20} />
          </View>
        </View>
      </View>

      {/* Recent Activity Skeleton */}
      <View className="rounded-2xl border border-slate-200 bg-white p-4 mt-5">
        {/* Judul section */}
        <Shimmer height={18} width={140} />
        <View className="h-3" />

        {/* Grid 2x2 meniru StatTile */}
        <View className="rounded-2xl">
          {/* Row 1 */}
          <View className="flex-row -mx-1 mb-2">
            <SkeletonStatTile />
            <SkeletonStatTile />
          </View>
          {/* Row 2 */}
          <View className="flex-row -mx-1">
            <SkeletonStatTile />
            <SkeletonStatTile />
          </View>
        </View>
      </View>
    </View>
  );
}
