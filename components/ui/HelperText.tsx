import React from "react";
import { StyleSheet, Text } from "react-native";

export default function HelperText({
  type = "error",
  children,
}: {
  type?: "error" | "info" | "success";
  children: React.ReactNode;
}) {
  return (
    <Text
      style={[
        styles.base,
        type === "error" && styles.error,
        type === "success" && styles.success,
      ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: { marginTop: 8 },
  error: { color: "#b91c1c" },
  success: { color: "#166534" },
});
