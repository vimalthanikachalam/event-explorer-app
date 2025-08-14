import React from "react";
import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  children: React.ReactNode;
  scroll?: boolean; // default true
  contentStyle?: ViewStyle;
};

export default function Screen({ children, contentStyle }: Props) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View
        style={[
          styles.container,
          I18nManager.isRTL && styles.rtl,
          contentStyle,
        ]}>
        <View style={{ width: "100%", flex: 1 }}>{children}</View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  rtl: { direction: "rtl" as any },
});
