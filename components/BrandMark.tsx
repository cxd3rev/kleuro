import { Image } from "react-native";

type BrandMarkProps = {
  size?: "sm" | "lg";
  withName?: boolean;
};

export function BrandMark({ size = "lg", withName = true }: BrandMarkProps) {
  const isLarge = size === "lg";

  if (withName) {
    return (
      <Image
        source={require("../assets/logo-wordmark.png")}
        accessibilityLabel="Kleuro"
        resizeMode="contain"
        style={{
          width: isLarge ? 220 : 152,
          height: isLarge ? 56 : 39,
        }}
      />
    );
  }

  return (
    <Image
      source={require("../assets/logo-mark.png")}
      accessibilityLabel="Kleuro"
      resizeMode="contain"
      style={{
        width: isLarge ? 64 : 44,
        height: isLarge ? 48 : 33,
      }}
    />
  );
}
