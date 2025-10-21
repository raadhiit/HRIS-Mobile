// shared/hooks/useDetectedLocation.ts
import * as Location from "expo-location";
import { Linking, Platform } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { DetectedCoords, UseDetectedLocationOptions } from "@/shared/types/location";

export function useDetectedLocation(opts: UseDetectedLocationOptions = {}) {
  const {
    simulateError = false,
    timeoutMs = 15000,
    alwaysRequestOnMount = false,
    resolveName = false,
    antiMock = true,
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
            accuracy: Location.Accuracy.Highest,
            mayShowUserSettingsDialog: true, // ini valid di expo-location
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Waktu ambil lokasi habis.")), timeoutMs)
          ),
        ]);

        // === Anti-mock: andalkan flag dari Android ===
        const isMocked = (position as any)?.mocked === true;
        if (antiMock && Platform.OS === "android" && isMocked) {
          setError("Mock location terdeteksi. Matikan aplikasi lokasi palsu."); // opsional
        }

        const { latitude, longitude, accuracy, speed } = position.coords;
        const ts = typeof position.timestamp === "number" ? position.timestamp : Date.now();

        let name: string | null = null;
        if (resolveName) {
          name = await reverseToName(latitude, longitude);
        }

        if (isCancelled) return;
        setCoords({
          latitude,
          longitude,
          accuracy: accuracy ?? null,
          timestamp: ts,
          speed: speed ?? null,
          mocked: isMocked,
          ageMs: Date.now() - ts,
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
  }, [ensurePermission, resolveName, simulateError, timeoutMs, antiMock]);

  useEffect(() => {
    if (alwaysRequestOnMount) {
      ensurePermission();
      refresh();
    }
  }, [alwaysRequestOnMount, ensurePermission, refresh]);

  return { locationName, coords, loading, error, refresh, ensurePermission };
}
