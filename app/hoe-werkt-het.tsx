import { useRouter } from "expo-router";
import { View } from "react-native";
import { AppText } from "../components/AppText";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { StepCard } from "../components/StepCard";

export default function HowItWorksScreen() {
  const router = useRouter();

  return (
    <Screen>
      <ScreenHeader title="Hoe werkt het?" />
      <AppText
        variant="bold"
        className="mb-3 text-3xl leading-10 text-kleuro-dark"
      >
        Van foto tot kleurinspiratie
      </AppText>
      <AppText className="mb-8 text-base leading-7 text-kleuro-muted">
        Kleuro helpt je om schilderwerken vooraf te visualiseren. Zo maak je
        meteen een weloverwogen keuze voor je woning.
      </AppText>
      <StepCard
        step="1"
        title="Foto van je woning"
        description="Upload een duidelijke foto van de gevel of de ruimte die je wilt laten schilderen."
      />
      <StepCard
        step="2"
        title="Oppervlakken en kleuren"
        description="Geef aan wat geschilderd moet worden en kies kleuren die bij jouw huis passen."
      />
      <StepCard
        step="3"
        title="Visualisatie"
        description="Bekijk hoe je woning eruit zou kunnen zien na de schilderwerken."
      />
      <StepCard
        step="4"
        title="Advies op maat"
        description="Deel je project en ontvang daarna persoonlijk contact van een schilder."
      />
      <View className="mt-4">
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
    </Screen>
  );
}
