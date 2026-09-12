import { Image, View } from "react-native";
import { AppText } from "./AppText";

export function HousePreview() {
  return (
    <View className="items-center py-4">
      <View className="h-[210px] w-[220px] items-center justify-center">
        <Image
          source={require("../assets/logo-mark-nobg.png")}
          accessibilityLabel="Kleuro"
          resizeMode="contain"
          style={{ width: 180, height: 180, backgroundColor: "transparent" }}
        />
      </View>
      <View className="rounded-full bg-kleuro-cream px-4 py-2">
        <AppText variant="medium" className="text-xs text-kleuro-dark">
          Nieuwe gevelkleur in één blik
        </AppText>
      </View>
    </View>
  );
}
