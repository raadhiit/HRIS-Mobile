import { useEffect, useState } from "react";


type UseDetectedLocationOptions = {
  simulateError?: boolean;     // untuk DEV: paksa error
  initialName?: string | null; // kalau mau default nama lokasi
};

export function useDetectedLocation(opts: UseDetectedLocationOptions = {}) {
  const { simulateError = false, initialName = null } = opts;

  const [locationName, setLocationName] = useState<string | null>(initialName);
  const [loading, setLoading] = useState<boolean>(!initialName);
  const [error, setError] = useState<string | null>(null);

  const detect = () => {
    setLoading(true);
    setError(null);
    console.log("[useDetectedLocation] mulai deteksi...");
    const t = setTimeout(() => {
      if (simulateError) {
        console.log("[useDetectedLocation] simulasi ERROR");
        setError("Gagal mendeteksi lokasi (simulasi).");
        setLocationName(null);
      } else {
        console.log("[useDetectedLocation] simulasi SUKSES: RS Harapan Mulia");
        setLocationName("RS Harapan Mulia");
      }
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  };

  useEffect(() => detect(), [simulateError]);

  return { locationName, loading, error, refresh: detect };
}

/**
 * DEV VERSION:
 * - Memalsukan deteksi lokasi dengan delay singkat.
 * - Saat production, ganti isi effect ke expo-location / RN Geolocation.
 */


/* ===================== PRODUCTION NOTES =====================
- Ganti implementasi `detect()`:
  import * as Location from "expo-location";
  1) minta permission: await Location.requestForegroundPermissionsAsync()
  2) get coords: await Location.getCurrentPositionAsync()
  3) reverse geocode: await Location.reverseGeocodeAsync({ latitude, longitude })
  4) setLocationName(...) dari result (nama tempat/alamat), atau cocokkan ke geofence perusahaan.
  5) atur loading/error sesuai hasil.

- iOS: tambahkan NSLocationWhenInUseUsageDescription di app.json/app.config.js
- Android: pastikan permission ACCESS_COARSE/FINE_LOCATION dan handling Android 12+.
============================================================= */
