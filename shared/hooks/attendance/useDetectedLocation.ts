// shared/hooks/useDetectedLocation.ts
import * as Location from "expo-location";
import { Linking } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { DetectedCoords, UseDetectedLocationOptions } from "@/shared/types/location";

export function useDetectedLocation(opts: UseDetectedLocationOptions = {}) {
  const {
    simulateError = false,
    timeoutMs = 15000,
    alwaysRequestOnMount = false,
    resolveName = false,
  } = opts;

  const [locationName, setLocationName] = useState<string | null>(null);
  const [coords, setCoords] = useState<DetectedCoords | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reverseToName = async (lat: number, lon: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
      const r = results?.[0];
      if (!r) return null;
      const parts = [r.name, r.street, r.district, r.city || r.subregion, r.region]
        .filter(Boolean)
        .slice(0, 3);
      return parts.length ? parts.join(", ") : null;
    } catch {
      return null;
    }
  };

  const ensurePermission = useCallback(async () => {
    const current = await Location.getForegroundPermissionsAsync();
    if (!current.granted) {
      const req = await Location.requestForegroundPermissionsAsync();
      if (!req.granted) {
        setError("Izin lokasi tidak diberikan. Aktifkan di pengaturan.");
        try { await Linking.openSettings(); } catch {}
        return false;
      }
    }
    return true;
  }, []);

  const refresh = useCallback(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const run = async () => {
      try {
        if (simulateError) throw new Error("Gagal mendeteksi lokasi (simulasi).");

        const ok = await ensurePermission();
        if (!ok) throw new Error("Izin lokasi belum diberikan.");

        const position = await Promise.race([
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Waktu ambil lokasi habis.")), timeoutMs)
          ),
        ]);

        const { latitude, longitude, accuracy } = position.coords;

        let name: string | null = null;
        if (resolveName) {
          name = await reverseToName(latitude, longitude);
        }

        if (isCancelled) return;
        setCoords({
          latitude,
          longitude,
          accuracy: accuracy ?? null,
          timestamp: Date.now(),
        });
        setLocationName(name);
      } catch (e: any) {
        if (isCancelled) return;
        setCoords(null);
        setLocationName(null);
        setError(e?.message || "Gagal mendeteksi lokasi.");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    run();
    return () => { isCancelled = true; };
  }, [ensurePermission, resolveName, simulateError, timeoutMs]);

  useEffect(() => {
    if (alwaysRequestOnMount) {
      ensurePermission();
      refresh();
    }
  }, [alwaysRequestOnMount, ensurePermission, refresh]);

  return { locationName, coords, loading, error, refresh, ensurePermission };
}
