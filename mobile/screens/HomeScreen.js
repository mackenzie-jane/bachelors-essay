import { ScrollView, Text, StyleSheet } from "react-native";
import { colors, spacing, fontSizes } from "../theme";
import CaptureBox from "../components/CaptureBox";

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Language Detector</Text>
      <Text style={styles.subtitle}>What would you like to translate?</Text>

      <CaptureBox
        icon="image-outline"
        label="Image"
        onPress={() => navigation.navigate("Image")}
      />
      <CaptureBox
        icon="mic-outline"
        label="Audio"
        onPress={() => navigation.navigate("Audio")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingTop: 80, gap: spacing.md },
  title: { fontSize: fontSizes.title, fontWeight: "bold", color: colors.text },
  subtitle: { fontSize: fontSizes.body, color: colors.textMuted },
});
