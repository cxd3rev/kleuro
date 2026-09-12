import { View } from "react-native";
import { AppText } from "./AppText";

export function HousePreview() {
  return (
    <View className="items-center py-4">
      <View className="h-[210px] w-[220px] items-center justify-center">
        <View className="absolute top-2 h-24 w-24 rotate-45 rounded-2xl bg-kleuro-dark" />
        <View className="absolute bottom-8 h-32 w-40 overflow-hidden rounded-b-[28px] rounded-t-lg bg-kleuro-card">
          <View className="mt-10 flex-row justify-between px-5">
            <View className="h-12 w-9 rounded-t-md bg-white" />
            <View className="h-9 w-9 rounded-lg bg-kleuro-primary" />
            <View className="h-9 w-9 rounded-lg bg-[#F7C56A]" />
          </View>
        </View>
      </View>
      <View className="rounded-full bg-kleuro-cream px-4 py-2">
        <AppText variant="medium" className="text-xs text-kleuro-dark">
          Nieuwe gevelkleur in één blik
        </AppText>
      </View>
    </View>
  );
}
