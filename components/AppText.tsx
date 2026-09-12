import { Text, type TextProps } from "react-native";
import { fonts } from "../constants/theme";

type Variant = "regular" | "medium" | "semibold" | "bold";

type AppTextProps = TextProps & {
  variant?: Variant;
  className?: string;
};

export function AppText({
  variant = "regular",
  className,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      className={className}
      style={[{ fontFamily: fonts[variant] }, style]}
      {...props}
    />
  );
}
