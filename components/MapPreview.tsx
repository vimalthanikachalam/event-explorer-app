import { getMapView } from "@/common/helper";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

type Props = {
  latitude: number;
  longitude: number;
  label?: string;
  onOpenExternal?: () => void;
};

export default function MapPreview({
  latitude,
  longitude,
  label,
  onOpenExternal,
}: Props) {
  const hasCoords =
    typeof latitude === "number" && typeof longitude === "number";

  if (!hasCoords) {
    return (
      <Pressable onPress={onOpenExternal} style={styles.fallback}>
        <Text style={styles.fallbackText}>{label || "Open in Maps"}</Text>
      </Pressable>
    );
  }


  return (
    <Pressable
      onPress={onOpenExternal}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={label || "Open in Maps"}>
      <WebView source={{ html: getMapView(latitude, longitude, label) }} style={{ flex: 1 }} />
      <View style={styles.overlayLabel} pointerEvents="none">
        <Text style={styles.overlayText}>{label || "Open in Maps"}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 260,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
    backgroundColor: "#e2e8f0",
  },
  mapWrapper: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlayLabel: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderRadius: 8,
    width: "100%",
  },
  overlayText: { color: "white", fontWeight: "600" },
  fallback: {
    height: 160,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  fallbackText: { color: "#334155", fontWeight: "600" },
});
