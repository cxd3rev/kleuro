import { Pressable, type PressableProps } from "react-native";
import { colors } from "../constants/theme";
import { AppText } from "./AppText";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-kleuro-primary",
  secondary: "bg-kleuro-dark",
  ghost: "bg-transparent border border-kleuro-line",
};

const labelColor: Record<ButtonVariant, string> = {
  primary: colors.dark,
  secondary: colors.background,
  ghost: colors.dark,
};

export function Button({
  label,
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      className={`min-h-[56px] w-full items-center justify-center rounded-2xl px-6 active:opacity-80 ${variantClass[variant]} ${disabled ? "opacity-50" : ""}`}
      {...props}
    >
      <AppText
        variant="bold"
        className="text-base"
        style={{ color: labelColor[variant] }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
