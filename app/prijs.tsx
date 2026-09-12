import { useRouter } from "expo-router";
import { View } from "react-native";
import { AppText } from "../components/AppText";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import {
  calculateIndicativeRange,
  formatEuroRange,
} from "../config/pricing";
import { WORK_OPTIONS } from "../constants/work";
import { useProject } from "../context/ProjectContext";

function parseOptionalNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) {
    return undefined;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default function PrijsScreen() {
  const router = useRouter();
  const { details } = useProject();
  const range = calculateIndicativeRange({
    facadeM2: parseOptionalNumber(details.facadeM2),
    doorCount: details.doorCount || undefined,
    garageDoorCount: details.garageDoorCount || undefined,
    windowM2: parseOptionalNumber(details.windowM2),
  });

  return (
    <Screen>
      <ScreenHeader title="Prijs" />
      <AppText variant="bold" className="mb-3 text-2xl leading-8 text-kleuro-dark">
        Indicatieve prijs
      </AppText>
      <AppText className="mb-6 text-base leading-7 text-kleuro-muted">
        Een eerste inschatting. De nodige werkzaamheden zitten automatisch in
        deze prijs, jij hoeft ze niet zelf te kiezen.
      </AppText>

      <View className="mb-5 rounded-3xl bg-kleuro-dark px-5 py-8">
        <AppText variant="medium" className="mb-2 text-sm text-white/70">
          Indicatieve prijs
        </AppText>
        <AppText variant="bold" className="text-3xl text-white">
          {formatEuroRange(range.low, range.high)}
        </AppText>
      </View>

      <View className="mb-5 rounded-3xl border border-kleuro-line bg-kleuro-card p-5">
        <AppText variant="semibold" className="mb-2 text-base text-kleuro-dark">
          Waarop is dit gebaseerd?
        </AppText>
        <AppText className="mb-2 text-[15px] leading-6 text-kleuro-muted">
          {range.usedAssumedFacade
            ? `Geen geveloppervlakte ingevuld. We rekenen met een gebruikelijke schatting van circa ${range.facadeM2} m².`
            : `Circa ${range.facadeM2} m² gevel volgens jouw schatting.`}
        </AppText>
        <AppText className="text-[15px] leading-6 text-kleuro-muted">
          Inbegrepen: {WORK_OPTIONS.map((item) => item.label).join(", ")}.
        </AppText>
      </View>

      <View className="mb-6 rounded-3xl bg-kleuro-cream p-5">
        <AppText className="text-[15px] leading-6 text-kleuro-dark">
          Dit is een indicatieve prijsinschatting en geen definitieve offerte.
          De uiteindelijke prijs hangt onder andere af van de staat van de
          ondergrond, de exacte oppervlakte en de gekozen materialen.
        </AppText>
      </View>

      <Button label="Verder" onPress={() => router.push("/contact")} />
    </Screen>
  );
}
