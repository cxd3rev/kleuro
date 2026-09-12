import { View } from "react-native";
import { AppText } from "./AppText";

type BrandMarkProps = {
  size?: "sm" | "lg";
};

export function BrandMark({ size = "lg" }: BrandMarkProps) {
  const box = size === "lg" ? "h-16 w-16 rounded-[20px]" : "h-11 w-11 rounded-2xl";
  const letter = size === "lg" ? "text-3xl" : "text-xl";

  return (
    <View className="flex-row items-center">
      <View className={`${box} items-center justify-center bg-kleuro-primary`}>
        <AppText variant="bold" className={`${letter} text-kleuro-dark`}>
          K
        </AppText>
      </View>
      <AppText
        variant="bold"
        className={`ml-3 text-kleuro-dark ${size === "lg" ? "text-2xl" : "text-lg"}`}
      >
        Kleuro
      </AppText>
    </View>
  );
}
