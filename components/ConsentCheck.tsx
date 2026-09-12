import { Pressable, View } from "react-native";
import { AppText } from "./AppText";

export function ConsentCheck({
  label,
  checked,
  onToggle,
  required,
  error,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  required?: boolean;
  error?: string;
}) {
  return (
    <View className="mb-3">
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={required ? `${label} Verplicht` : label}
        onPress={onToggle}
        className={`min-h-[56px] flex-row items-start rounded-3xl border bg-kleuro-card px-4 py-3 ${
          error ? "border-[#C2410C]" : "border-kleuro-line"
        }`}
      >
        <View
          className={`mr-3 mt-0.5 h-6 w-6 items-center justify-center rounded-md ${
            checked ? "bg-kleuro-primary" : "border border-kleuro-line bg-white"
          }`}
        >
          {checked ? (
            <AppText variant="bold" className="text-xs text-kleuro-dark">
              ✓
            </AppText>
          ) : null}
        </View>
        <AppText className="flex-1 text-[15px] leading-6 text-kleuro-dark">
          {label}
          {required ? " *" : ""}
        </AppText>
      </Pressable>
      {error ? (
        <AppText className="mt-2 text-sm leading-5 text-[#C2410C]">{error}</AppText>
      ) : null}
    </View>
  );
}
