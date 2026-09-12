import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Linking, Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { useProject } from "../context/ProjectContext";
import { processPhoto, unsupportedTypeMessage } from "../lib/photo";
import * as ImagePicker from "expo-image-picker";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const { setPhoto } = useProject();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [busy, setBusy] = useState(false);
  const insets = useSafeAreaInsets();

  const openCameraSettings = () => {
    if (Platform.OS === "web") {
      return;
    }
    void Linking.openSettings();
  };

  const handleCapturedUri = async (uri: string, width?: number, height?: number) => {
    const processed = await processPhoto({
      uri,
      width,
      height,
      mimeType: "image/jpeg",
      fileName: "camera.jpg",
    });
    setPhoto(processed);
    router.replace("/foto");
  };

  const takePicture = async () => {
    try {
      setBusy(true);
      if (Platform.OS === "web") {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPermission.granted) {
          Alert.alert(
            "Camera",
            "Kleuro heeft toegang tot je camera nodig om een foto van je woning te maken.",
          );
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          quality: 0.9,
          allowsEditing: false,
        });
        if (!result.canceled && result.assets[0]) {
          await handleCapturedUri(
            result.assets[0].uri,
            result.assets[0].width,
            result.assets[0].height,
          );
        }
        return;
      }

      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      if (photo?.uri) {
        await handleCapturedUri(photo.uri, photo.width, photo.height);
      }
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      Alert.alert(
        "Camera",
        code === "UNSUPPORTED_TYPE"
          ? unsupportedTypeMessage
          : "Er is iets misgegaan. Probeer het opnieuw.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (!permission) {
    return (
      <Screen>
        <ScreenHeader title="Camera" />
        <AppText className="text-base text-kleuro-muted">Camera wordt geladen...</AppText>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <ScreenHeader title="Camera" />
        <AppText
          variant="bold"
          className="mb-3 text-2xl text-kleuro-dark"
        >
          Camera toegang
        </AppText>
        <AppText className="mb-8 text-base leading-7 text-kleuro-muted">
          Kleuro gebruikt de camera om een foto van je woning te maken.
        </AppText>
        <Button
          label={permission.canAskAgain === false ? "Open instellingen" : "Sta camera toe"}
          onPress={() => {
            if (permission.canAskAgain === false) {
              openCameraSettings();
              return;
            }
            void requestPermission();
          }}
        />
      </Screen>
    );
  }

  if (Platform.OS === "web") {
    return (
      <Screen>
        <ScreenHeader title="Camera" />
        <AppText className="mb-8 text-base leading-7 text-kleuro-muted">
          Maak een duidelijke foto van je woning.
        </AppText>
        <Button
          label={busy ? "Bezig..." : "Foto maken"}
          onPress={takePicture}
          disabled={busy}
        />
      </Screen>
    );
  }

  return (
    <View className="flex-1 bg-kleuro-dark">
      <CameraView
        ref={cameraRef}
        facing={facing}
        style={{ flex: 1 }}
      />
      <View
        className="absolute inset-0 justify-between px-6"
        style={{
          paddingTop: Math.max(insets.top, 12),
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sluit camera"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-white"
        >
          <AppText variant="bold" className="text-lg text-kleuro-dark">
            ←
          </AppText>
        </Pressable>
        <View className="items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Maak foto"
            disabled={busy}
            onPress={takePicture}
            className="h-20 w-20 items-center justify-center rounded-full bg-kleuro-primary"
          >
            <View className="h-16 w-16 rounded-full border-4 border-white" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Wissel camera"
            onPress={() => setFacing((current) => (current === "back" ? "front" : "back"))}
            className="mt-5 min-h-[44px] items-center justify-center"
          >
            <AppText variant="medium" className="text-white">
              Wissel camera
            </AppText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
