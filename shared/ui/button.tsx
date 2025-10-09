import { 
    Pressable, 
    Text, 
    View, 
    ActivityIndicator,
    PressableProps,
    Animated
} from "react-native";
import React, { useEffect, useRef, useState, useMemo } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends PressableProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;      
  isLoading?: boolean;    
  loadingText?: string;   
  autoLoading?: boolean;
  minLoadingMs?: number;
  left?: React.ReactNode; 
  right?: React.ReactNode;
  fullWidth?: boolean;  
  className?: string;  
}

const base = "rounded-2xl items-center justify-center flex-row gap-2 active:opacity-90";
const sizes: Record<ButtonSize, string> = {
    sm: "px-4 py-2",
    md: "px-5 py-3",
    lg: "px-6 py-4",
};

const variants: Record<ButtonVariant, string> = {
    primary: "bg-blue-600",
    secondary: "bg-slate-800",
    outline: "border border-slate-300 bg-transparent",
    ghost: "bg-transparent",
    destructive: "bg-red-500",
    success: "bg-emerald-600",
};


const label: Record<ButtonVariant, string> = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-slate-800",
    ghost: "text-slate-800",
    destructive: "text-white",
    success: "text-white",
};


const spinner: Record<ButtonVariant, "#fff" | "#1f2937"> = {
    primary: "#fff",
    secondary: "#fff",
    outline: "#1f2937", // slate-800
    ghost: "#1f2937",
    destructive: "#fff",
    success: "#fff",
};

export function Button({
    title,
    variant = "primary",
    size = "md",
    isLoading: isLoadingProp,
    loadingText,
    autoLoading = false,
    minLoadingMs = 1200,
    left,
    right,
    fullWidth,
    disabled,
    className,
    onPress,
    ...props
}: ButtonProps) {
    const [localLoading, setLocalLoading] = useState(false);
    const isLoading = autoLoading ? localLoading : !!isLoadingProp;

    const isDisabled = disabled || isLoading;

    // Fade untuk konten loading
    const fade = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(fade, {
        toValue: isLoading ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
        }).start();
    }, [isLoading, fade]);

    const handlePress = useMemo(() => {
    if (!autoLoading) return onPress;

    return async (e: any) => {
        if (!onPress) return;
        try {
        setLocalLoading(true);
        const start = Date.now();

        const maybePromise = (onPress as any)(e);
        if (maybePromise && typeof maybePromise.then === "function") {
            await maybePromise;
        }

        const elapsed = Date.now() - start;
        if (elapsed < minLoadingMs) {
            await new Promise((r) => setTimeout(r, minLoadingMs - elapsed));
        }
        } finally {
        setLocalLoading(false);
        }
    };
    }, [autoLoading, onPress, minLoadingMs]);

    return (
        <Pressable
            android_ripple={{ color: "rgba(0,0,0,0.08)" }}
            // className={`${base} ${sizes[size]} ${variants[variant]} ${
            //     fullWidth ? "w-full" : ""
            // } ${isDisabled ? "opacity-60" : ""} ${className ?? ""}`}
            className={`${base} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${
                isDisabled ? "opacity-60" : ""
                } ${className ?? ""} ${variants[variant]}`
            }

            disabled={isDisabled}
            accessibilityRole="button"
            accessibilityState={{ disabled: !!isDisabled, busy: !!isLoading }}
            onPress={handlePress}
            {...props}
            style={({ pressed }) => [
                props.style as any,
                { opacity: pressed && !isDisabled ? 0.92 : 1 },
            ]}
            >
            {isLoading ? (
                <Animated.View
                    style={{ opacity: fade }}
                    className="flex-row items-center gap-2"
                >
                <ActivityIndicator color={spinner[variant]} />
                <Text
                    className={`tracking-wide font-roboto-medium ${label[variant]}`}
                    style={{ fontFamily: "Roboto_500Medium" }}
                >
                    {loadingText ?? "Loading..."}
                </Text>
                </Animated.View>
            ) : (
                <>
                {!!left && <View className="mr-1">{left}</View>}
                <Text
                    className={`tracking-wide font-roboto-medium ${label[variant]}`}
                    style={{ fontFamily: "Roboto_500Medium" }}
                >
                    {title}
                </Text>
                    {!!right && <View className="ml-1">{right}</View>}
                </>
            )}
        </Pressable>
    );
}
