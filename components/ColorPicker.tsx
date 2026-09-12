import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { PAINT_PRESETS, normalizeHex, type ColorChoice } from "../constants/paints";
import { AppText } from "./AppText";

export function ColorPicker({
  value,
  onChange,
}: {
  value?: ColorChoice;
  onChange: (color: ColorChoice) => void;
}) {
  const [hexInput, setHexInput] = useState(value?.hex ?? "#");
  const [hexError, setHexError] = useState(false);

  const applyHex = () => {
    const hex = normalizeHex(hexInput);
    if (!hex) {
      setHexError(true);
      return;
    }
    setHexError(false);
    setHexInput(hex);
    onChange({ hex, label: "Eigen kleur" });
  };

  return (
    <View>
      <View className="mb-4 flex-row flex-wrap">
        {PAINT_PRESETS.map((preset) => {
          const selected = value?.hex.toUpperCase() === preset.hex.toUpperCase();
          return (
            <Pressable
              key={preset.hex}
              accessibilityRole="button"
              accessibilityLabel={preset.name}
              onPress={() => {
                setHexInput(preset.hex);
                setHexError(false);
                onChange({ hex: preset.hex, label: preset.name });
              }}
              className="mb-3 mr-3 w-[30%] min-w-[96px] items-center"
            >
              <View
                className={`h-12 w-full rounded-2xl border-2 ${selected ? "border-kleuro-dark" : "border-kleuro-line"}`}
                style={{ backgroundColor: preset.hex }}
              />
              <AppText
                variant={selected ? "semibold" : "regular"}
                className="mt-2 text-center text-xs text-kleuro-dark"
              >
                {preset.name}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <AppText variant="semibold" className="mb-2 text-sm text-kleuro-dark">
        Eigen HEX-kleur
      </AppText>
      <View className="flex-row items-center">
        <View
          className="mr-3 h-12 w-12 rounded-2xl border border-kleuro-line"
          style={{ backgroundColor: normalizeHex(hexInput) ?? "#FFFFFF" }}
        />
        <TextInput
          value={hexInput}
          onChangeText={(text) => {
            setHexInput(text);
            setHexError(false);
          }}
          placeholder="#3A3A3A"
          placeholderTextColor="#6F6F6F"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="HEX-kleur"
          className="min-h-[56px] flex-1 rounded-2xl border border-kleuro-line px-4 text-base text-kleuro-dark"
        />
      </View>
      {hexError ? (
        <AppText className="mt-2 text-sm text-kleuro-muted">
          Voer een geldige HEX-code in, bijvoorbeeld #3A3A3A.
        </AppText>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Gebruik HEX-kleur"
        onPress={applyHex}
        className="mt-3 min-h-[48px] items-center justify-center rounded-2xl border border-kleuro-line"
      >
        <AppText variant="semibold" className="text-sm text-kleuro-dark">
          Gebruik deze HEX-kleur
        </AppText>
      </Pressable>
    </View>
  );
}
