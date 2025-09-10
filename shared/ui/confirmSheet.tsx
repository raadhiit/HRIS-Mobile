import { Button } from "@/shared/ui/button";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Modal, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
};

export default function ConfirmSheet({
  visible,
  title = "Konfirmasi",
  message = "Apakah kamu yakin?",
  confirmText = "Ya",
  cancelText = "Batal",
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  const overlay = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    if (visible) {
      overlay.setValue(0);
      cardOpacity.setValue(0);
      cardScale.setValue(0.96);

      Animated.parallel([
        Animated.timing(overlay, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(cardScale, { toValue: 1, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    } else {
      overlay.setValue(0);
      cardOpacity.setValue(0);
      cardScale.setValue(0.96);
    }
  }, [visible]);

  const animateOutThen = (cb?: () => void) => {
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 0, duration: 140, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(cardScale, { toValue: 0.96, duration: 140, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(overlay, { toValue: 0, duration: 160, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]).start(() => cb?.());
  };

  const handleBackdrop = () => animateOutThen(onCancel);
  const handleConfirm = async () => {
    animateOutThen(async () => {
      try { await onConfirm(); } finally { onCancel(); }
    });
  };

  const overlayStyle = { opacity: overlay, zIndex: 40 } as any;
  const cardStyle = { opacity: cardOpacity, transform: [{ scale: cardScale }], zIndex: 50 } as any;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={handleBackdrop}>
      {/* LAPISAN OVERLAY GELAP (penuh layar) */}
      <Animated.View
        className="absolute inset-0 bg-black/50"
        style={overlayStyle}
      />

      {/* BACKDROP CLICK (di atas overlay, di bawah card) */}
      <Pressable className="absolute inset-0" onPress={handleBackdrop} style={{ zIndex: 45 }} />

      {/* CONTAINER TENGAH */}
      <View className="flex-1 items-center justify-center px-6">
        <Animated.View
          style={cardStyle}
          className="w-full rounded-3xl bg-white p-5 shadow-xl border border-black/5"
        >
          <View className="flex-row items-center">
            <MaterialIcons
              name={destructive ? "report-problem" : "help-outline"}
              size={22}
              color={destructive ? "#b91c1c" : "#111827"}
            />
            <Text className="ml-2 text-base font-semibold">{title}</Text>
          </View>

          <Text className="text-gray-600 mt-2">{message}</Text>

          <View className="mt-4 flex-row gap-3">
            <Button title={cancelText} variant="outline" className="flex-1" onPress={handleBackdrop} />
            <Button
              title={confirmText}
              variant={destructive ? "destructive" : "primary"}
              className="flex-1"
              autoLoading
              minLoadingMs={800}
              onPress={handleConfirm}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
