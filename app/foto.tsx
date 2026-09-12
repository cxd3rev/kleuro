import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Linking, Platform, View } from "react-native";
import { AnalysisLoader } from "../components/AnalysisLoader";
import { AppText } from "../components/AppText";
import { Button } from "../components/Button";
import { QualityNotice } from "../components/QualityNotice";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { useProject } from "../context/ProjectContext";
import { analyzeHomePhoto, apiErrorMessage } from "../lib/api";
import { pickFromLibrary, unsupportedTypeMessage } from "../lib/photo";

export default function FotoScreen() {
  const router = useRouter();
  const {
    photo,
    setPhoto,
    setSurfaces,
    setAnalysisFailed,
    setExtraWarnings,
    extraWarnings,
    useManualSurfaces,
  } = useProject();
  const [busy, setBusy] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Er is iets misgegaan. Probeer het opnieuw.",
  );

  const showError = (message: string, openSettings = false) => {
    if (openSettings && Platform.OS !== "web") {
      Alert.alert("Foto", message, [
        { text: "Annuleren", style: "cancel" },
        { text: "Instellingen", onPress: () => void Linking.openSettings() },
      ]);
      return;
    }
    Alert.alert("Foto", message);
  };

  const handleLibrary = async () => {
    try {
      setBusy(true);
      const next = await pickFromLibrary();
      if (next) {
        setPhoto(next);
        setHasError(false);
      }
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      if (code === "LIBRARY_PERMISSION" || code === "LIBRARY_SETTINGS") {
        showError(
          "Kleuro heeft toegang tot je foto's nodig om een woningfoto te kiezen.",
          code === "LIBRARY_SETTINGS",
        );
      } else if (code === "UNSUPPORTED_TYPE") {
        showError(unsupportedTypeMessage);
      } else {
        showError("Er is iets misgegaan. Probeer het opnieuw.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleAnalyze = async () => {
    if (!photo) {
      return;
    }

    try {
      setAnalyzing(true);
      setHasError(false);
      setErrorMessage("Er is iets misgegaan. Probeer het opnieuw.");
      const result = await analyzeHomePhoto({
        imageBase64: photo.base64,
        mimeType: photo.mimeType,
      });
      setSurfaces(result.surfaces);
      setAnalysisFailed(false);
      const extra: typeof extraWarnings = [];
      if (result.tooDark && !photo.warnings.includes("dark")) {
        extra.push("dark");
      }
      if (!result.houseVisible && !photo.warnings.includes("no-house")) {
        extra.push("no-house");
      }
      setExtraWarnings(extra);
      router.push("/oppervlakken");
    } catch (error) {
      setHasError(true);
      setErrorMessage(
        apiErrorMessage(error, "Er is iets misgegaan. Probeer het opnieuw."),
      );
    } finally {
      setAnalyzing(false);
    }
  };

  if (analyzing) {
    return <AnalysisLoader />;
  }

  return (
    <Screen>
      <ScreenHeader title="Foto" />
      <AppText
        variant="bold"
        className="mb-3 text-2xl leading-8 text-kleuro-dark"
      >
        Maak of upload een duidelijke foto van je woning.
      </AppText>
      <AppText className="mb-6 text-base leading-7 text-kleuro-muted">
        Kies een foto uit je galerij of maak een nieuwe foto. JPG, JPEG, PNG en
        WebP zijn welkom.
      </AppText>

      {photo ? (
        <>
          <Image
            source={{ uri: photo.uri }}
            className="mb-4 h-64 w-full rounded-3xl bg-kleuro-card"
            resizeMode="cover"
            accessibilityLabel="Gekozen woningfoto"
          />
          <QualityNotice issues={[...photo.warnings, ...extraWarnings]} />
          {hasError ? (
            <View className="mb-4 rounded-3xl bg-kleuro-cream p-4">
              <AppText className="mb-4 text-[15px] leading-6 text-kleuro-dark">
                {errorMessage}
              </AppText>
              <Button label="Probeer opnieuw" onPress={handleAnalyze} />
              <View className="h-3" />
              <Button
                label="Zelf kiezen"
                variant="ghost"
                onPress={() => {
                  useManualSurfaces();
                  router.push("/oppervlakken");
                }}
              />
            </View>
          ) : (
            <Button label="Gebruik deze foto" onPress={handleAnalyze} />
          )}
          <View className="h-3" />
          <Button
            label="Foto vervangen"
            variant="secondary"
            onPress={handleLibrary}
            disabled={busy}
          />
          <View className="h-3" />
          <Button
            label="Opnieuw een foto maken"
            variant="ghost"
            onPress={() => router.push("/camera")}
            disabled={busy}
          />
        </>
      ) : (
        <>
          <Button
            label="Foto maken"
            onPress={() => router.push("/camera")}
            disabled={busy}
          />
          <View className="h-3" />
          <Button
            label="Kies uit galerij"
            variant="secondary"
            onPress={handleLibrary}
            disabled={busy}
          />
        </>
      )}
    </Screen>
  );
}
