import { useRouter } from "expo-router";
import { View } from "react-native";
import { AppText } from "../components/AppText";
import { Button } from "../components/Button";
import { ColorPicker } from "../components/ColorPicker";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { useProject } from "../context/ProjectContext";

export default function KleurenScreen() {
  const router = useRouter();
  const { photo, surfaces, colorChoices, setSurfaceColor } = useProject();
  const selected = surfaces.filter((item) => item.selected);
  const allColored = selected.every((item) => Boolean(colorChoices[item.id]));

  if (!photo) {
    return (
      <Screen>
        <ScreenHeader title="Kleuren" />
        <AppText className="mb-8 text-base leading-7 text-kleuro-muted">
          Upload eerst een foto van je woning.
        </AppText>
        <Button label="Naar foto" onPress={() => router.replace("/foto")} />
      </Screen>
    );
  }

  if (selected.length === 0) {
    return (
      <Screen>
        <ScreenHeader title="Kleuren" />
        <AppText className="mb-8 text-base leading-7 text-kleuro-muted">
          Kies eerst welke onderdelen je wilt aanpassen.
        </AppText>
        <Button
          label="Naar oppervlakken"
          onPress={() => router.replace("/oppervlakken")}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Kleuren" />
      <AppText variant="bold" className="mb-3 text-2xl leading-8 text-kleuro-dark">
        Kies je kleuren
      </AppText>
      <AppText className="mb-6 text-base leading-7 text-kleuro-muted">
        Kies per onderdeel een kleur. Daarna maken we een visualisatie van je
        woning.
      </AppText>

      {selected.map((surface) => {
        const choice = colorChoices[surface.id];
        return (
          <View
            key={surface.id}
            className="mb-5 rounded-3xl border border-kleuro-line bg-kleuro-card p-4"
          >
            <View className="mb-4 flex-row items-center justify-between">
              <AppText variant="semibold" className="text-lg text-kleuro-dark">
                {surface.name}
              </AppText>
              {choice ? (
                <View className="flex-row items-center">
                  <View
                    className="mr-2 h-6 w-6 rounded-full border border-kleuro-line"
                    style={{ backgroundColor: choice.hex }}
                  />
                  <AppText variant="medium" className="text-sm text-kleuro-dark">
                    {choice.label}
                  </AppText>
                </View>
              ) : null}
            </View>
            <ColorPicker
              value={choice}
              onChange={(color) => setSurfaceColor(surface.id, color)}
            />
          </View>
        );
      })}

      <View className="mb-6 rounded-3xl bg-kleuro-cream p-4">
        <AppText variant="semibold" className="mb-2 text-base text-kleuro-dark">
          Jouw kleuren
        </AppText>
        {selected.map((surface) => (
          <AppText
            key={surface.id}
            className="mb-1 text-[15px] leading-6 text-kleuro-dark"
          >
            {surface.name} → {colorChoices[surface.id]?.label ?? "nog geen kleur"}
          </AppText>
        ))}
      </View>

      <Button
        label="Visualisatie maken"
        disabled={!allColored}
        onPress={() => router.push("/visualisatie")}
      />
    </Screen>
  );
}
