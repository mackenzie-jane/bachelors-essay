import { Pressable, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, fontSizes } from "../theme";

export default function PrimaryButton({ title, onPress, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
  },
  disabled: { opacity: 0.5 },
  text: { color: "#FFFFFF", fontSize: fontSizes.body, fontWeight: "600" },
});
