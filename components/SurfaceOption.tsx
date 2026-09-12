import { Pressable, View } from "react-native";
import { AppText } from "./AppText";
import type { SurfaceResult } from "../constants/surfaces";

export function SurfaceOption({
  surface,
  onToggle,
}: {
  surface: SurfaceResult;
  onToggle: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: surface.selected }}
      accessibilityLabel={surface.name}
      onPress={onToggle}
      className="mb-3 min-h-[56px] flex-row items-center rounded-3xl border border-kleuro-line bg-kleuro-card px-4"
    >
      <View
        className={`mr-4 h-6 w-6 items-center justify-center rounded-md ${surface.selected ? "bg-kleuro-primary" : "border border-kleuro-line bg-white"}`}
      >
        {surface.selected ? (
          <AppText variant="bold" className="text-xs text-kleuro-dark">
            ✓
          </AppText>
        ) : null}
      </View>
      <View className="flex-1 py-3">
        <AppText variant="semibold" className="text-base text-kleuro-dark">
          {surface.name}
        </AppText>
        {surface.visible ? (
          <AppText className="mt-1 text-xs text-kleuro-muted">Op de foto</AppText>
        ) : null}
      </View>
    </Pressable>
  );
}
