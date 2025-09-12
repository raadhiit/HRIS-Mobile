import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TextInputProps, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export type InputType = "text" | "textarea" | "number" | "password" | "email" | "date" | "time";

export interface InputProps extends Omit<TextInputProps, "onChangeText"> {
  label?: string;
  helperText?: string;
  errorText?: string;
  type?: InputType;
  required?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  containerClassName?: string;
  onChangeText?: (text: string) => void;
}

export default function Input({
  label,
  helperText,
  errorText,
  type = "text",
  required,
  left,
  right,
  containerClassName,
  value,
  onChangeText,
  editable = true,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const isPicker = type === "date" || type === "time";

  const {
    keyboardType,
    secureTextEntry,
    multiline,
    numberOfLines,
    textAlignVertical,
    autoCapitalize,
    autoCorrect,
  } = useMemo(() => {
    switch (type) {
      case "number":
        return {
          keyboardType: "numeric" as TextInputProps["keyboardType"],
          secureTextEntry: false,
          multiline: false,
          numberOfLines: 1,
          textAlignVertical: "center" as const,
          autoCapitalize: "none" as const,
          autoCorrect: false,
        };
      case "password":
        return {
          keyboardType: "default" as TextInputProps["keyboardType"],
          secureTextEntry: !showPassword,
          multiline: false,
          numberOfLines: 1,
          textAlignVertical: "center" as const,
          autoCapitalize: "none" as const,
          autoCorrect: false,
        };
      case "email":
        return {
          keyboardType: "email-address" as TextInputProps["keyboardType"],
          secureTextEntry: false,
          multiline: false,
          numberOfLines: 1,
          textAlignVertical: "center" as const,
          autoCapitalize: "none" as const,
          autoCorrect: false,
        };
      case "textarea":
        return {
          keyboardType: "default" as TextInputProps["keyboardType"],
          secureTextEntry: false,
          multiline: true,
          numberOfLines: 5,
          textAlignVertical: "top" as const,
          autoCapitalize: "sentences" as const,
          autoCorrect: true,
        };
      case "date":
      case "time":
        return {
          keyboardType: "numbers-and-punctuation" as TextInputProps["keyboardType"],
          secureTextEntry: false,
          multiline: false,
          numberOfLines: 1,
          textAlignVertical: "center" as const,
          autoCapitalize: "none" as const,
          autoCorrect: false,
        };
      default:
        return {
          keyboardType: "default" as TextInputProps["keyboardType"],
          secureTextEntry: false,
          multiline: false,
          numberOfLines: 1,
          textAlignVertical: "center" as const,
          autoCapitalize: "sentences" as const,
          autoCorrect: true,
        };
    }
  }, [type, showPassword]);

  const RightAccessory =
    right ??
    (type === "password" ? (
      <Pressable
        onPress={() => setShowPassword((s) => !s)}
        className="px-2 py-1 -mr-1"
        accessibilityLabel={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
      >
        <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={18} color="#64748b" />
      </Pressable>
    ) : null);

  // === Helpers untuk date/time ===
  const openPicker = () => {
    if (!editable) return;
    if (isPicker) setPickerVisible(true);
  };
  const closePicker = () => setPickerVisible(false);

  const parseInitialDate = () => {
    try {
      if (type === "date" && typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [y, m, d] = value.split("-").map(Number);
        return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
      }
      if (type === "time" && typeof value === "string" && /^\d{2}:\d{2}$/.test(value)) {
        const [h, mm] = value.split(":").map(Number);
        const now = new Date();
        now.setHours(h || 0, mm || 0, 0, 0);
        return now;
      }
    } catch {}
    return new Date();
  };

  const formatDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const formatTime = (d: Date) => {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const onConfirmPicker = (d: Date) => {
    if (type === "date") onChangeText?.(formatDate(d));
    else if (type === "time") onChangeText?.(formatTime(d));
    closePicker();
  };

  return (
    <View className={["gap-1", containerClassName].filter(Boolean).join(" ")}>
      {!!label && (
        <Text className="text-[12px] text-slate-600 mt-3">
          {label}
          {required && <Text className="text-rose-500"> *</Text>}
        </Text>
      )}

      <View
        className={[
          "flex-row items-center rounded-xl border bg-white",
          errorText ? "border-rose-300" : "border-slate-200",
          editable ? "opacity-100" : "opacity-70",
        ].join(" ")}
      >
        {!!left && <View className="pl-3 pr-1">{left}</View>}

        {/* Untuk date/time: pakai Pressable agar tidak buka keyboard */}
        {isPicker ? (
          <Pressable className="flex-1" onPress={openPicker} accessibilityRole="button">
            <TextInput
              className="flex-1 px-3 py-2 text-slate-800 h-10"
              value={(value as string) ?? ""}
              placeholderTextColor="#94a3b8"
              editable={false}               // <- jangan munculkan keyboard
              pointerEvents="none"           // <- biar Pressable yang terima tap
              {...rest}
            />
          </Pressable>
        ) : (
          <TextInput
            className={["flex-1 px-3 py-2 text-slate-800", multiline ? "min-h-[92px]" : "h-10"].join(" ")}
            value={value as string}
            onChangeText={onChangeText}
            placeholderTextColor="#94a3b8"
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={textAlignVertical}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            editable={editable}
            {...rest}
          />
        )}

        {!!RightAccessory && <View className="pr-2">{RightAccessory}</View>}
      </View>

      {errorText ? (
        <Text className="text-[11px] text-rose-600">{errorText}</Text>
      ) : !!helperText ? (
        <Text className="text-[11px] text-slate-500">{helperText}</Text>
      ) : null}

      {/* Modal Date/Time Picker */}
      {isPicker && (
        <DateTimePickerModal
          isVisible={pickerVisible}
          mode={type === "date" ? "date" : "time"}
          date={parseInitialDate()}
          onConfirm={onConfirmPicker}
          onCancel={closePicker}
          is24Hour
          // minuteInterval={1} // optional
        />
      )}
    </View>
  );
}
