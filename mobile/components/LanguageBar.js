import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, fontSizes } from "../theme";
import { languageName } from "../languages";

export default function LanguageBar({ source, target }) {
  return (
    <View style={styles.bar}>
      <Text style={styles.lang}>
        {source ? languageName(source) : "Original"}
      </Text>
      <Ionicons name="arrow-forward" size={20} color={colors.textMuted} />
      <Text style={styles.lang}>{languageName(target)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 0.25,
    borderColor: colors.detail,
    padding: spacing.md,
  },
  lang: { fontSize: fontSizes.body, color: colors.text },
});
