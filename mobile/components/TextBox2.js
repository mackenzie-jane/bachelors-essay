import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, fontSizes } from "../theme";

export default function TextBox2({ label, text }) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.text} selectable>
        {text || "—"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  label: { fontSize: fontSizes.caption, color: colors.textMuted },
  text: { fontSize: fontSizes.body, color: colors.text },
});
