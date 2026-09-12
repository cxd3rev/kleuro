import { View } from "react-native";
import { AppText } from "./AppText";
import { QUALITY_MESSAGES, type QualityIssue } from "../lib/photoQuality";

export function QualityNotice({ issues }: { issues: QualityIssue[] }) {
  if (issues.length === 0) {
    return null;
  }

  return (
    <View className="mb-4 rounded-3xl bg-kleuro-cream p-4">
      {issues.map((issue) => (
        <AppText
          key={issue}
          className="mb-2 text-[15px] leading-6 text-kleuro-dark"
        >
          {QUALITY_MESSAGES[issue]}
        </AppText>
      ))}
    </View>
  );
}
