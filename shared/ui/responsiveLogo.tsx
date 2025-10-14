// shared/ui/ResponsiveLogo.tsx
import React, { useEffect, useState } from "react";
import { Image, ImageResolvedAssetSource, useWindowDimensions } from "react-native";

type RemoteSrc = { uri: string; width?: number; height?: number };
type Src = number | RemoteSrc;

type Props = {
  source: Src;
  maxWidth?: number;
  widthPct?: number;
  maxHeight?: number;
  maxHeightPct?: number;
  accessibilityLabel?: string;
  borderRadius?: number;
};

export default function ResponsiveLogo({
  source,
  maxWidth = 480,
  widthPct = 0.75,
  maxHeight,
  maxHeightPct = 0.30,
  accessibilityLabel = "Logo",
  borderRadius = 0,
}: Props) {
  const { width: sw, height: sh } = useWindowDimensions();
  const [ratio, setRatio] = useState<number>(2); // w/h fallback

  useEffect(() => {
    if (typeof source === "number") {
      const r: ImageResolvedAssetSource | undefined = Image.resolveAssetSource(source);
      if (r?.width && r?.height) setRatio(r.width / r.height);
      return;
    }
    if (source.width && source.height) {
      setRatio(source.width / source.height);
    } else if (source.uri) {
      Image.getSize(
        source.uri,
        (w, h) => setRatio(w / h),
        () => setRatio(2)
      );
    }
  }, [source]);

  // batas lebar & tinggi
  const maxW = Math.min(sw * widthPct, maxWidth);
  const maxH = maxHeight ?? sh * maxHeightPct;

  // hitung ukuran final dengan clamp di tinggi
  let w = maxW;
  let h = w / ratio;
  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }

  return (
    <Image
      source={source as any}
      resizeMode="contain"
      accessible
      accessibilityLabel={accessibilityLabel}
      style={{
        width: w,
        height: h,
        borderRadius,
        maxWidth: maxW,
        maxHeight: maxH,
      }}
    />
  );
}
