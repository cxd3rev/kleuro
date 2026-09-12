import { useRouter } from "expo-router";
import { View } from "react-native";
import { AppText } from "../components/AppText";
import { Button } from "../components/Button";
import { QualityNotice } from "../components/QualityNotice";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { SurfaceOption } from "../components/SurfaceOption";
import { useProject } from "../context/ProjectContext";

export default function OppervlakkenScreen() {
  const router = useRouter();
  const {
    photo,
    surfaces,
    toggleSurface,
    analysisFailed,
    extraWarnings,
  } = useProject();
  const selectedCount = surfaces.filter((item) => item.selected).length;

  if (!photo) {
    return (
      <Screen>
        <ScreenHeader title="Oppervlakken" />
        <AppText className="mb-8 text-base leading-7 text-kleuro-muted">
          Upload eerst een foto van je woning.
        </AppText>
        <Button label="Naar foto" onPress={() => router.replace("/foto")} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Oppervlakken" />
      <AppText
        variant="bold"
        className="mb-3 text-2xl leading-8 text-kleuro-dark"
      >
        Welke onderdelen wil je aanpassen?
      </AppText>
      <AppText className="mb-6 text-base leading-7 text-kleuro-muted">
        {analysisFailed
          ? "Kies zelf de onderdelen die je wilt laten schilderen."
          : "We hebben een voorstel gemaakt. Je kunt dit nog aanpassen."}
      </AppText>
      <QualityNotice issues={extraWarnings} />
      {surfaces.map((surface) => (
        <SurfaceOption
          key={surface.id}
          surface={surface}
          onToggle={() => toggleSurface(surface.id)}
        />
      ))}
      <View className="mt-4">
        <Button
          label="Verder"
          disabled={selectedCount === 0}
          onPress={() => router.push("/kleuren")}
        />
        <AppText
          variant="medium"
          className="mt-3 text-center text-sm text-kleuro-muted"
        >
          {selectedCount === 0
            ? "Kies minstens één onderdeel om verder te gaan."
            : `${selectedCount} onderdeel${selectedCount === 1 ? "" : "en"} geselecteerd`}
        </AppText>
      </View>
    </Screen>
  );
}
