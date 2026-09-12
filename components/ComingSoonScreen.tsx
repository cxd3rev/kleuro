import { type Href, useRouter } from "expo-router";
import { FLOW_ROUTES, type FlowHref } from "../constants/flow";
import { Button } from "./Button";
import { Screen } from "./Screen";
import { ScreenHeader } from "./ScreenHeader";
import { AppText } from "./AppText";
import { View } from "react-native";

type ComingSoonScreenProps = {
  href: FlowHref;
};

export function ComingSoonScreen({ href }: ComingSoonScreenProps) {
  const router = useRouter();
  const index = FLOW_ROUTES.findIndex((step) => step.href === href);
  const step = FLOW_ROUTES[index];
  const next = FLOW_ROUTES[index + 1];

  return (
    <Screen>
      <ScreenHeader title={step.title} />
      <View className="mb-6 self-start rounded-full bg-kleuro-cream px-3 py-1">
        <AppText variant="medium" className="text-xs text-kleuro-dark">
          Stap {index + 1} van {FLOW_ROUTES.length}
        </AppText>
      </View>
      <AppText variant="bold" className="mb-3 text-3xl leading-10 text-kleuro-dark">
        {step.title} volgt binnenkort
      </AppText>
      <AppText className="mb-8 text-base leading-7 text-kleuro-muted">
        {step.description}. Dit onderdeel bouwen we in de volgende fase. De
        navigatie staat al klaar, zodat de volledige flow later soepel
        aansluit.
      </AppText>
      {next ? (
        <View className="mb-4">
          <Button
            label={`Ga naar ${next.title}`}
            variant="secondary"
            onPress={() => router.push(next.href as Href)}
          />
        </View>
      ) : null}
      <Button label="Terug naar home" onPress={() => router.replace("/home")} />
    </Screen>
  );
}
