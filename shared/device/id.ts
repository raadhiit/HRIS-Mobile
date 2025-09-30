import * as Application from "expo-application";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const key = 'device.id';

export async function getDeviceId(): Promise<string> {
    const cached = await SecureStore.getItemAsync(key);
    if (cached) return cached;

    let id = "";
    if ( Platform.OS === "android") {
        id = (await Application.getAndroidId()).toString();
    } else if ( Platform.OS === "ios") {
        id = (await Application.getIosApplicationReleaseTypeAsync()).toString();
    } else {
        id = `${Platform.OS}-${Application.applicationId}-${Application.nativeBuildVersion}`;
    }
    if (!id) id = `${Platform.OS}-${Date.now()}`;
    await SecureStore.setItemAsync(key, id);
    return id;
}