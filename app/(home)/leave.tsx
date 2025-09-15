import {
  View,
  Text,
  Pressable,
  ScrollView
} from "react-native";
import Page from "@/features/home/layouts/Page";
import Section from "@/features/home/components/Section";
import Input from "@/shared/ui/input";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

export default function LeavePage() {
  const [form, setForm] = useState({
    date: "",
    start: "17:00",
    end: "",
    reason: "",
    note: "",
  });

  
  return (
    <Page
      title="Ajukan Cuti/izin"
      keyboard
    >
      <View>

      </View>
    </Page>
  );
}
