import { useRouter } from "expo-router";
import { View } from "react-native";
import { BrandMark } from "../components/BrandMark";
import { Button } from "../components/Button";
import { HousePreview } from "../components/HousePreview";
import { ParentBrand } from "../components/ParentBrand";
import { Screen } from "../components/Screen";
import { AppText } from "../components/AppText";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View className="min-h-full justify-between">
        <View>
          <BrandMark />
        </View>

        <HousePreview />

        <View>
          <AppText
            variant="bold"
            className="mb-4 text-[34px] leading-[42px] text-kleuro-dark"
          >
            Bekijk je woning in een nieuwe kleur
          </AppText>
          <AppText className="mb-8 text-base leading-7 text-kleuro-muted">
            Upload een foto van je woning, kies je favoriete kleuren en ontdek
            hoe je woning eruit zou kunnen zien.
          </AppText>
          <Button
            label="Aan de slag"
            onPress={() => router.push("/home")}
          />
          <View className="mt-8">
            <ParentBrand />
          </View>
        </View>
      </View>
    </Screen>
  );
}
