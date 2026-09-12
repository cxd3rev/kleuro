import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { AppText } from "../components/AppText";
import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import { Button } from "../components/Button";
import { LoadingScreen } from "../components/LoadingScreen";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { colorSignature, useProject } from "../context/ProjectContext";
import { apiErrorMessage, visualizeHomePhoto } from "../lib/api";

export default function VisualisatieScreen() {
  const router = useRouter();
  const {
    photo,
    surfaces,
    colorChoices,
    visualization,
    setVisualization,
  } = useProject();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "De visualisatie kon niet worden gemaakt. Probeer het opnieuw.",
  );
  const lastTried = useRef("");

  const selected = surfaces.filter((item) => item.selected);
  const signature = colorSignature(selected, colorChoices);
  const readyToGenerate =
    Boolean(photo) &&
    selected.length > 0 &&
    selected.every((item) => colorChoices[item.id]);
  const needsGeneration =
    readyToGenerate && visualization?.signature !== signature;

  const generate = useCallback(async () => {
    if (!photo) {
      return;
    }

    try {
      setLoading(true);
      setError(false);
      setErrorMessage("De visualisatie kon niet worden gemaakt. Probeer het opnieuw.");
      lastTried.current = signature;
      const imageUri = await visualizeHomePhoto({
        imageBase64: photo.base64,
        mimeType: photo.mimeType,
        paints: selected.map((item) => ({
          id: item.id,
          surfaceName: item.name,
          color: colorChoices[item.id]!,
        })),
      });
      setVisualization({ imageUri, signature });
    } catch (error) {
      setError(true);
      setErrorMessage(
        apiErrorMessage(
          error,
          "De visualisatie kon niet worden gemaakt. Probeer het opnieuw.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [colorChoices, photo, selected, setVisualization, signature]);

  useEffect(() => {
    if (!needsGeneration || loading || error) {
      return;
    }
    if (lastTried.current === signature) {
      return;
    }
    void generate();
  }, [error, generate, loading, needsGeneration, signature]);

  if (!photo) {
    return (
      <Screen>
        <ScreenHeader title="Visualisatie" />
        <AppText className="mb-8 text-base leading-7 text-kleuro-muted">
          Upload eerst een foto van je woning.
        </AppText>
        <Button label="Naar foto" onPress={() => router.replace("/foto")} />
      </Screen>
    );
  }

  if (!readyToGenerate) {
    return (
      <Screen>
        <ScreenHeader title="Visualisatie" />
        <AppText className="mb-8 text-base leading-7 text-kleuro-muted">
          Kies eerst kleuren voor de geselecteerde onderdelen.
        </AppText>
        <Button label="Naar kleuren" onPress={() => router.replace("/kleuren")} />
      </Screen>
    );
  }

  if (loading || (needsGeneration && !error)) {
    return (
      <LoadingScreen
        title="Je woning wordt aangepast..."
        subtitle="We schilderen alleen de gekozen onderdelen."
      />
    );
  }

  if (error) {
    return (
      <Screen>
        <ScreenHeader title="Visualisatie" />
        <View className="mb-6 rounded-3xl bg-kleuro-cream p-4">
          <AppText className="text-[15px] leading-6 text-kleuro-dark">
            {errorMessage}
          </AppText>
        </View>
        <Button
          label="Probeer opnieuw"
          onPress={() => {
            lastTried.current = "";
            void generate();
          }}
        />
        <View className="h-3" />
        <Button
          label="Andere kleur proberen"
          variant="ghost"
          onPress={() => router.push("/kleuren")}
        />
      </Screen>
    );
  }

  if (!visualization) {
    return (
      <LoadingScreen
        title="Je woning wordt aangepast..."
        subtitle="We schilderen alleen de gekozen onderdelen."
      />
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Visualisatie" />
      <AppText variant="bold" className="mb-3 text-2xl leading-8 text-kleuro-dark">
        Zo zou je woning eruit kunnen zien.
      </AppText>
      <AppText className="mb-6 text-base leading-7 text-kleuro-muted">
        Schuif om de originele foto met de nieuwe kleuren te vergelijken.
      </AppText>
      <BeforeAfterSlider
        beforeUri={photo.uri}
        afterUri={visualization.imageUri}
        aspectRatio={photo.width / Math.max(photo.height, 1)}
      />
      <View className="mt-6">
        <Button
          label="Andere kleur proberen"
          onPress={() => router.push("/kleuren")}
        />
        <View className="h-3" />
        <Button
          label="Verder"
          variant="secondary"
          onPress={() => router.push("/projectinfo")}
        />
      </View>
    </Screen>
  );
}
