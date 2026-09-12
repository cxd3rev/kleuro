import { useRouter } from "expo-router";
import { Image, View } from "react-native";
import { AppText } from "../components/AppText";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { formatEuroRange } from "../config/pricing";
import { useProject } from "../context/ProjectContext";
import { priceRangeFromDetails } from "../lib/pricingInput";

export default function BedanktScreen() {
  const router = useRouter();
  const { contact, visualization, surfaces, colorChoices, details, resetProject } =
    useProject();
  const firstName = contact.firstName.trim() || "daar";
  const range = priceRangeFromDetails(details);
  const chosenColors = surfaces
    .filter((item) => item.selected && colorChoices[item.id])
    .map((item) => ({
      name: item.name,
      label: colorChoices[item.id]?.label ?? "",
      hex: colorChoices[item.id]?.hex ?? "",
    }));

  return (
    <Screen>
      <AppText variant="bold" className="mb-3 text-2xl leading-8 text-kleuro-dark">
        Bedankt, {firstName}!
      </AppText>
      <AppText className="mb-6 text-base leading-7 text-kleuro-muted">
        We hebben je aanvraag goed ontvangen.
      </AppText>

      {visualization?.imageUri ? (
        <View className="mb-5 overflow-hidden rounded-3xl bg-kleuro-card">
          <Image
            source={{ uri: visualization.imageUri }}
            accessibilityLabel="Jouw visualisatie"
            className="h-52 w-full"
            resizeMode="cover"
          />
        </View>
      ) : null}

      {chosenColors.length > 0 ? (
        <View className="mb-5 rounded-3xl border border-kleuro-line bg-kleuro-card p-5">
          <AppText variant="semibold" className="mb-3 text-base text-kleuro-dark">
            Gekozen kleuren
          </AppText>
          {chosenColors.map((item) => (
            <View key={`${item.name}-${item.hex}`} className="mb-2 flex-row items-center">
              <View
                className="mr-3 h-5 w-5 rounded-full border border-kleuro-line"
                style={{ backgroundColor: item.hex || "#FFFFFF" }}
              />
              <AppText className="text-[15px] text-kleuro-dark">
                {item.name} → {item.label || item.hex}
              </AppText>
            </View>
          ))}
        </View>
      ) : null}

      <View className="mb-8 rounded-3xl bg-kleuro-dark px-5 py-6">
        <AppText variant="medium" className="mb-2 text-sm text-white/70">
          Indicatieve prijs
        </AppText>
        <AppText variant="bold" className="text-2xl text-white">
          {formatEuroRange(range.low, range.high)}
        </AppText>
      </View>

      <Button
        label="Nieuwe woning bekijken"
        onPress={() => {
          resetProject();
          router.replace("/foto");
        }}
      />
    </Screen>
  );
}
