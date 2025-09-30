import React, { useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS === "1";
const BASE_URL  = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:8000";

type Item = { label: string; value: string };

type Props = {
  label?: string;
  placeholder?: string;
  value: string | null;
  onChange: (val: string) => void;
};

export default function LeaveTypeDropdown({
  label = "Jenis Cuti/Izin",
  placeholder = "Pilih jenis",
  value,
  onChange,
}: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        if (USE_MOCKS) {
          // DEV: ambil dari mock
          // const mapped = mockLeaveTypes.map(t => ({ label: t.name, value: t.id }));
          // if (alive) setItems(mapped);
        } else {
          // PROD: ambil dari API
          const res = await fetch(`${BASE_URL}/api/leave-types`, { headers: { Accept: "application/json" }});
          const data = await res.json(); // ekspektasi: [{id,name},...]
          const mapped: Item[] = (Array.isArray(data) ? data : data?.data ?? []).map(
            (t: any) => ({ label: t.name, value: String(t.id) })
          );
          if (alive) setItems(mapped);
        }
      } catch (e) {
        console.warn("[LeaveTypeDropdown] fetch failed:", e);
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const selected = useMemo(() => items.find(i => i.value === value)?.label ?? "", [items, value]);

  return (
    <View style={{ marginTop: 12 }}>
      {!!label && <Text className="text-slate-800 mb-2">{label}</Text>}
      <Dropdown
        data={items}
        labelField="label"
        valueField="value"
        value={value}
        placeholder={placeholder}
        search
        disable={loading}
        // styling (NativeWind tidak langsung bekerja di komponen ini, jadi pakai style RN):
        style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, paddingHorizontal: 14, height: 38, backgroundColor: "white" }}
        placeholderStyle={{ color: "#94a3b8" }}
        selectedTextStyle={{ color: "#0f172a" }}
        inputSearchStyle={{ height: 40, color: "#0f172a" }}
        onChange={(item: Item) => onChange(item.value)}
        renderItem={(item: Item) => (
          <View style={{ paddingVertical: 10, paddingHorizontal: 14 }}>
            <Text style={{ color: "#0f172a" }}>{item.label}</Text>
          </View>
        )}
      />
      {!!selected && <Text className="text-slate-500 text-xs mt-1">Terpilih: {selected}</Text>}
    </View>
  );
}
