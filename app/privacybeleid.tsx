import { View } from "react-native";
import { AppText } from "../components/AppText";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { PRIVACY_POLICY_VERSION } from "../constants/privacy";

export default function PrivacyPolicyScreen() {
  return (
    <Screen>
      <ScreenHeader title="Privacybeleid" />
      <AppText variant="bold" className="mb-3 text-2xl leading-8 text-kleuro-dark">
        Privacybeleid
      </AppText>
      <AppText className="mb-6 text-sm text-kleuro-muted">
        Versie {PRIVACY_POLICY_VERSION}
      </AppText>

      <View className="mb-5">
        <AppText variant="semibold" className="mb-2 text-base text-kleuro-dark">
          Waarom vragen we gegevens?
        </AppText>
        <AppText className="text-[15px] leading-6 text-kleuro-muted">
          Kleuro is gratis. We gebruiken je gegevens om je aanvraag te
          behandelen, je te bereiken over de mogelijkheden en een indicatie van
          je project te bewaren. Zonder deze gegevens kunnen we je niet
          terugbellen of mailen.
        </AppText>
      </View>

      <View className="mb-5">
        <AppText variant="semibold" className="mb-2 text-base text-kleuro-dark">
          Welke gegevens
        </AppText>
        <AppText className="text-[15px] leading-6 text-kleuro-muted">
          Naam, e-mailadres, telefoonnummer en optioneel adres of bericht. Ook
          bewaren we je gekozen kleuren, oppervlakken, indicatieve prijs en
          eventueel de woningfoto en visualisatie. Foto's worden privé bewaard
          en zijn niet openbaar zichtbaar.
        </AppText>
      </View>

      <View className="mb-5">
        <AppText variant="semibold" className="mb-2 text-base text-kleuro-dark">
          Contact en marketing
        </AppText>
        <AppText className="text-[15px] leading-6 text-kleuro-muted">
          Contact over je aanvraag is nodig om je te helpen. Marketing over
          schilderwerken is optioneel en staat standaard uit. Je kunt die keuze
          later wijzigen door ons te laten weten dat je geen berichten meer wilt.
        </AppText>
      </View>

      <View className="mb-5">
        <AppText variant="semibold" className="mb-2 text-base text-kleuro-dark">
          Bewaartermijn
        </AppText>
        <AppText className="text-[15px] leading-6 text-kleuro-muted">
          We bewaren je aanvraag zolang dat nodig is om je te helpen of om
          wettelijke verplichtingen na te komen.
        </AppText>
      </View>
    </Screen>
  );
}
