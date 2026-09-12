import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { AppText } from "../components/AppText";
import { BrandMark } from "../components/BrandMark";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { StepCard } from "../components/StepCard";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <BrandMark size="sm" />
      <View className="mt-8">
        <AppText
          variant="bold"
          className="mb-3 text-[32px] leading-[40px] text-kleuro-dark"
        >
          Bekijk je woning in een nieuwe kleur
        </AppText>
        <AppText className="text-base leading-7 text-kleuro-muted">
          Upload een foto van je woning, kies je favoriete kleuren en ontdek hoe
          je woning eruit zou kunnen zien.
        </AppText>
      </View>

      <View className="mt-8">
        <Button
          label="Probeer het gratis"
          onPress={() => router.push("/foto")}
        />
        <AppText
          variant="medium"
          className="mt-3 text-center text-sm text-kleuro-muted"
        >
          Gratis • Geen account nodig
        </AppText>
      </View>

      <View className="mt-10">
        <AppText variant="semibold" className="mb-4 text-lg text-kleuro-dark">
          Zo werkt Kleuro
        </AppText>
        <StepCard
          step="1"
          title="Upload een foto"
          description="Maak of kies een foto van je woning."
        />
        <StepCard
          step="2"
          title="Kies kleuren"
          description="Selecteer de tinten die bij jouw huis passen."
        />
        <StepCard
          step="3"
          title="Bekijk het resultaat"
          description="Zie meteen hoe je woning eruit kan zien na schilderwerken."
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Hoe werkt het?"
        onPress={() => router.push("/hoe-werkt-het")}
        className="mt-4 min-h-[56px] items-center justify-center rounded-2xl border border-kleuro-line"
      >
        <AppText variant="semibold" className="text-base text-kleuro-dark">
          Hoe werkt het?
        </AppText>
      </Pressable>
    </Screen>
  );
}
