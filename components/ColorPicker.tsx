import { useState } from "react";
import { Platform, Pressable, TextInput, View } from "react-native";
import {
  PAINT_GROUPS,
  normalizeHex,
  presetByHex,
  type ColorChoice,
} from "../constants/paints";
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

  const applyHex = (raw: string, label?: string) => {
    const hex = normalizeHex(raw);
    if (!hex) {
      setHexError(true);
      return;
    }
    setHexError(false);
    setHexInput(hex);
    onChange({ hex, label: label ?? presetByHex(hex)?.name ?? "Eigen kleur" });
  };

  return (
    <View>
      {PAINT_GROUPS.map((group) => (
        <View key={group.title} className="mb-4">
          <AppText variant="semibold" className="mb-2 text-sm text-kleuro-dark">
            {group.title}
          </AppText>
          <View className="flex-row flex-wrap">
            {group.colors.map((preset) => {
              const selected = value?.hex.toUpperCase() === preset.hex.toUpperCase();
              return (
                <Pressable
                  key={preset.hex}
                  accessibilityRole="button"
                  accessibilityLabel={preset.name}
                  onPress={() => applyHex(preset.hex, preset.name)}
                  className="mb-3 mr-3 w-[30%] min-w-[88px] items-center"
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
        </View>
      ))}

      <AppText variant="semibold" className="mb-2 text-sm text-kleuro-dark">
        Elke kleur
      </AppText>
      <AppText className="mb-3 text-sm leading-5 text-kleuro-muted">
        Niet in de lijst? Kies een eigen kleur. Elke HEX-code mag.
      </AppText>
      {Platform.OS === "web" ? (
        <View className="mb-3 flex-row items-center">
          <input
            aria-label="Kleurkiezer"
            type="color"
            value={normalizeHex(value?.hex ?? hexInput) ?? "#F5A623"}
            onChange={(event) => applyHex(event.target.value)}
            style={{
              width: 56,
              height: 56,
              padding: 0,
              border: "1px solid #E6E1D8",
              borderRadius: 16,
              background: "transparent",
              cursor: "pointer",
            }}
          />
          <AppText className="ml-3 flex-1 text-sm leading-5 text-kleuro-muted">
            Sleep of tik om elke kleur te kiezen.
          </AppText>
        </View>
      ) : null}
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
        onPress={() => applyHex(hexInput)}
        className="mt-3 min-h-[48px] items-center justify-center rounded-2xl border border-kleuro-line"
      >
        <AppText variant="semibold" className="text-sm text-kleuro-dark">
          Gebruik deze HEX-kleur
        </AppText>
      </Pressable>
    </View>
  );
}
