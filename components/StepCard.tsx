import { View } from "react-native";
import { AppText } from "./AppText";

type StepCardProps = {
  step: string;
  title: string;
  description: string;
};

export function StepCard({ step, title, description }: StepCardProps) {
  return (
    <View className="mb-3 rounded-3xl border border-kleuro-line bg-kleuro-card p-5">
      <View className="mb-3 h-8 w-8 items-center justify-center rounded-full bg-kleuro-primary">
        <AppText variant="bold" className="text-sm text-kleuro-dark">
          {step}
        </AppText>
      </View>
      <AppText variant="semibold" className="mb-1 text-base text-kleuro-dark">
        {title}
      </AppText>
      <AppText className="text-[15px] leading-6 text-kleuro-muted">
        {description}
      </AppText>
    </View>
  );
}
