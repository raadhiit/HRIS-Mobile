import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const webStore = {
  async getItemAsync(key: string) {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(key);
  },
  async setItemAsync(key: string, value: string) {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(key, value);
  },
  async deleteItemAsync(key: string) {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(key);
  },
};

export const Secure = Platform.OS === "web" ? webStore : SecureStore;
