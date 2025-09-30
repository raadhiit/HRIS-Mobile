// shared/ui/ResponsiveLogo.tsx
import React, { useEffect, useState } from "react";
import { Image, ImageResolvedAssetSource, useWindowDimensions } from "react-native";

type RemoteSrc = { uri: string; width?: number; height?: number };
type Src = number | RemoteSrc;

type Props = {
  source: Src;
  /** Maks lebar absolut (px) di layar besar */
  maxWidth?: number;
  /** Lebar relatif ke layar (0..1) */
  widthPct?: number;
  /** Maks tinggi absolut (px). Jika tidak diisi, dipakai maxHeightPct */
  maxHeight?: number;
  /** Maks tinggi relatif ke tinggi layar (0..1), default 0.3 = 30% */
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
        height: h,         // ⬅️ sekarang dibatasi, tidak akan kebesaran
        borderRadius,
        maxWidth: maxW,
        maxHeight: maxH,
      }}
    />
  );
}
