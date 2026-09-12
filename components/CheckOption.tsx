import { Pressable, View } from "react-native";
import { AppText } from "./AppText";

export function CheckOption({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={onToggle}
      className="mb-3 min-h-[56px] flex-row items-center rounded-3xl border border-kleuro-line bg-kleuro-card px-4"
    >
      <View
        className={`mr-4 h-6 w-6 items-center justify-center rounded-md ${checked ? "bg-kleuro-primary" : "border border-kleuro-line bg-white"}`}
      >
        {checked ? (
          <AppText variant="bold" className="text-xs text-kleuro-dark">
            ✓
          </AppText>
        ) : null}
      </View>
      <AppText variant="semibold" className="flex-1 py-3 text-base text-kleuro-dark">
        {label}
      </AppText>
    </Pressable>
  );
}
