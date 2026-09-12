import Constants from "expo-constants";
import { Platform } from "react-native";

export function getApiBaseUrl() {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }

  if (Platform.OS === "web") {
    return "http://localhost:3001";
  }

  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.linkingUri?.replace(/^[a-z]+:\/\//, "");
  const host = hostUri?.split(":")[0]?.replace(/\/.*$/, "");

  if (host && host !== "localhost" && host !== "127.0.0.1") {
    return `http://${host}:3001`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3001";
  }

  return "http://localhost:3001";
}
