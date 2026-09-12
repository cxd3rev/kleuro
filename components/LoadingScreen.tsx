import { ActivityIndicator, View } from "react-native";
import { AppText } from "./AppText";
import { Screen } from "./Screen";

type LoadingScreenProps = {
  title: string;
  subtitle?: string;
};

export function LoadingScreen({ title, subtitle }: LoadingScreenProps) {
  return (
    <Screen scroll={false}>
      <View className="flex-1 items-center justify-center px-4">
        <View className="mb-6 h-16 w-16 items-center justify-center rounded-full bg-kleuro-cream">
          <ActivityIndicator size="large" color="#F5A623" />
        </View>
        <AppText
          variant="bold"
          className="mb-3 text-center text-2xl text-kleuro-dark"
        >
          {title}
        </AppText>
        {subtitle ? (
          <AppText className="text-center text-base leading-7 text-kleuro-muted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </Screen>
  );
}
