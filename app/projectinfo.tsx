import { useRouter } from "expo-router";
import { TextInput, View } from "react-native";
import { AppText } from "../components/AppText";
import { Button } from "../components/Button";
import { NumberField, StepperField } from "../components/FormFields";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { useProject } from "../context/ProjectContext";

export default function ProjectInfoScreen() {
  const router = useRouter();
  const { details, setDetails } = useProject();

  return (
    <Screen>
      <ScreenHeader title="Projectinfo" />
      <AppText variant="bold" className="mb-3 text-2xl leading-8 text-kleuro-dark">
        Basisinformatie
      </AppText>
      <AppText className="mb-4 text-base leading-7 text-kleuro-muted">
        Deze gegevens zijn optioneel en alleen bedoeld als indicatie. Eén foto
        is niet genoeg voor een exacte meting of offerte.
      </AppText>
      <View className="mb-6 rounded-3xl bg-kleuro-cream p-4">
        <AppText className="text-[15px] leading-6 text-kleuro-dark">
          Vul in wat je weet. Schattingen zijn prima. We maken hier geen
          automatische oppervlaktemeting.
        </AppText>
      </View>

      <NumberField
        label="Geschatte geveloppervlakte"
        hint="Een ruwe schatting is voldoende."
        value={details.facadeM2}
        onChange={(facadeM2) => setDetails({ ...details, facadeM2 })}
        unit="m²"
        placeholder="bijv. 80"
      />
      <StepperField
        label="Aantal deuren"
        value={details.doorCount}
        onChange={(doorCount) => setDetails({ ...details, doorCount })}
      />
      <StepperField
        label="Aantal garagepoorten"
        value={details.garageDoorCount}
        onChange={(garageDoorCount) =>
          setDetails({ ...details, garageDoorCount })
        }
      />
      <NumberField
        label="Geschatte oppervlakte ramen"
        hint="Optioneel, als je een idee hebt van het raamoppervlak."
        value={details.windowM2}
        onChange={(windowM2) => setDetails({ ...details, windowM2 })}
        unit="m²"
        placeholder="bijv. 12"
      />

      <AppText variant="semibold" className="mb-2 text-base text-kleuro-dark">
        Extra informatie
      </AppText>
      <TextInput
        value={details.extraInfo}
        onChangeText={(extraInfo) => setDetails({ ...details, extraInfo })}
        placeholder="Bijvoorbeeld loszittende verf, bereikbaarheid of gewenste periode."
        placeholderTextColor="#6F6F6F"
        multiline
        textAlignVertical="top"
        accessibilityLabel="Extra informatie"
        className="mb-6 min-h-[120px] rounded-3xl border border-kleuro-line bg-kleuro-card px-4 py-4 text-base text-kleuro-dark"
      />

      <Button label="Bekijk indicatieve prijs" onPress={() => router.push("/prijs")} />
    </Screen>
  );
}
