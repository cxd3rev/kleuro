import { Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { AppText } from "../components/AppText";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen>
        <View className="flex-1 justify-center">
          <AppText variant="bold" className="mb-3 text-3xl text-kleuro-dark">
            Pagina niet gevonden
          </AppText>
          <AppText className="mb-8 text-base leading-7 text-kleuro-muted">
            Dit scherm bestaat niet. Ga terug naar het startscherm om verder te
            gaan.
          </AppText>
          <Button label="Naar startscherm" onPress={() => router.replace("/home")} />
        </View>
      </Screen>
    </>
  );
}
