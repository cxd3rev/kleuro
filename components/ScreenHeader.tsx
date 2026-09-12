import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { AppText } from "./AppText";

type ScreenHeaderProps = {
  title: string;
  showBack?: boolean;
};

export function ScreenHeader({ title, showBack = true }: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <View className="mb-6 min-h-[48px] flex-row items-center">
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ga terug"
          onPress={() => router.back()}
          className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-kleuro-card"
        >
          <AppText variant="bold" className="text-lg text-kleuro-dark">
            ←
          </AppText>
        </Pressable>
      ) : (
        <View className="mr-3 h-11 w-11" />
      )}
      <AppText variant="semibold" className="flex-1 text-lg text-kleuro-dark">
        {title}
      </AppText>
    </View>
  );
}
