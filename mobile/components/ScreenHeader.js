import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, fontSizes } from "../theme";

export default function ScreenHeader({ title, onBack }) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onBack} hitSlop={12}>
        <Ionicons name="chevron-back" size={24} color={colors.textMuted} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  title: {
    fontSize: fontSizes.heading,
    color: colors.textMuted,
    fontWeight: "bold",
  },
});
