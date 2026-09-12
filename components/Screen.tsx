import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ReactNode } from "react";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

export function Screen({ children, scroll = true }: ScreenProps) {
  const content = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="flex-grow px-6 pb-10 pt-2"
    >
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1 px-6 pb-10 pt-2">{children}</View>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["top", "bottom", "left", "right"]}
    >
      <KeyboardAvoidingView
        className="w-full max-w-[430px] flex-1 self-center"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
