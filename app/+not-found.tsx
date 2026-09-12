import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { AppText } from "../components/AppText";
import { Screen } from "../components/Screen";

export default function NotFoundScreen() {
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
          <Link href="/home" asChild>
            <AppText variant="bold" className="text-base text-kleuro-dark">
              Naar startscherm
            </AppText>
          </Link>
        </View>
      </Screen>
    </>
  );
}
