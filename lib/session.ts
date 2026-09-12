import * as Crypto from "expo-crypto";

export function createSessionId() {
  return Crypto.randomUUID();
}
