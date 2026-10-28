import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, fontSizes } from "../theme";

export default function CaptureBox({
  icon,
  iconColor,
  label,
  onPress,
  disabled,
  active,
  children,
}) {
  return (
    <Pressable
      style={[styles.box, active && styles.boxActive]}
      onPress={onPress}
      disabled={disabled}
    >
      {children ? (
        children
      ) : (
        <>
          <Ionicons
            name={icon}
            size={56}
            color={iconColor ?? colors.textMuted}
          />
          <Text style={styles.label}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.surface2,
    overflow: "hidden",
  },
  boxActive: {
    borderColor: colors.detail,
    borderStyle: "solid",
    borderWidth: 0.25,
  },
  label: { fontSize: fontSizes.body, color: colors.textMuted },
});
