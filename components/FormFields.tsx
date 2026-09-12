import { Pressable, TextInput, View, type TextInputProps } from "react-native";
import { AppText } from "./AppText";

export function TextField({
  label,
  value,
  onChange,
  required,
  error,
  hint,
  multiline,
  ...inputProps
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  multiline?: boolean;
} & Omit<TextInputProps, "value" | "onChange" | "onChangeText">) {
  return (
    <View className="mb-4">
      <AppText variant="semibold" className="mb-2 text-base text-kleuro-dark">
        {label}
        {required ? " *" : ""}
      </AppText>
      {hint ? (
        <AppText className="mb-2 text-sm leading-5 text-kleuro-muted">{hint}</AppText>
      ) : null}
      <TextInput
        {...inputProps}
        value={value}
        onChangeText={onChange}
        placeholderTextColor="#6F6F6F"
        accessibilityLabel={required ? `${label}, verplicht` : label}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        className={`rounded-2xl border bg-white px-4 text-base text-kleuro-dark ${
          multiline ? "min-h-[120px] py-4" : "min-h-[56px]"
        } ${error ? "border-[#C2410C]" : "border-kleuro-line"}`}
      />
      {error ? (
        <AppText className="mt-2 text-sm leading-5 text-[#C2410C]">{error}</AppText>
      ) : null}
    </View>
  );
}

export function NumberField({
  label,
  hint,
  value,
  onChange,
  unit,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  placeholder?: string;
}) {
  return (
    <View className="mb-4">
      <AppText variant="semibold" className="mb-2 text-base text-kleuro-dark">
        {label}
      </AppText>
      {hint ? (
        <AppText className="mb-2 text-sm leading-5 text-kleuro-muted">{hint}</AppText>
      ) : null}
      <View className="flex-row items-center">
        <TextInput
          value={value}
          onChangeText={(text) => onChange(text.replace(/[^0-9.,]/g, ""))}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor="#6F6F6F"
          accessibilityLabel={label}
          className="min-h-[56px] flex-1 rounded-2xl border border-kleuro-line bg-white px-4 text-base text-kleuro-dark"
        />
        {unit ? (
          <AppText variant="medium" className="ml-3 text-base text-kleuro-muted">
            {unit}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

export function StepperField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <View className="mb-4 flex-row items-center justify-between rounded-3xl border border-kleuro-line bg-kleuro-card px-4 py-3">
      <AppText variant="semibold" className="mr-3 flex-1 text-base text-kleuro-dark">
        {label}
      </AppText>
      <View className="flex-row items-center">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label} verlagen`}
          onPress={() => onChange(Math.max(0, value - 1))}
          className="h-11 w-11 items-center justify-center rounded-full bg-white"
        >
          <AppText variant="bold" className="text-xl text-kleuro-dark">
            −
          </AppText>
        </Pressable>
        <AppText variant="bold" className="mx-3 min-w-[28px] text-center text-lg text-kleuro-dark">
          {value}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label} verhogen`}
          onPress={() => onChange(value + 1)}
          className="h-11 w-11 items-center justify-center rounded-full bg-kleuro-primary"
        >
          <AppText variant="bold" className="text-xl text-kleuro-dark">
            +
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}
