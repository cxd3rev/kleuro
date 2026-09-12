import { Image, View } from "react-native";
import { AppText } from "./AppText";

export function ParentBrand() {
  return (
    <View
      className="items-center"
      accessible
      accessibilityLabel="Een merk van Dili Paints, kleur met klasse"
    >
      <AppText variant="medium" className="mb-1.5 text-[11px] text-kleuro-muted">
        Een merk van
      </AppText>
      <Image
        source={require("../assets/dili-paints-logo.png")}
        accessibilityLabel="Dili Paints"
        resizeMode="contain"
        style={{ width: 108, height: 50 }}
      />
    </View>
  );
}
