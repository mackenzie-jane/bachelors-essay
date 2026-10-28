import { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { fetch } from "expo/fetch";
import { File } from "expo-file-system";
import { API_URL } from "../config";

import ScreenHeader from "./ScreenHeader";
import LanguageBar from "./LanguageBar";
import PrimaryButton from "./PrimaryButton";
import TextBox from "./TextBox";
import TextBox2 from "./TextBox2";
import CaptureBox from "./CaptureBox";
import { languageName } from "../languages";

export default function ImageUpload() {
  const [image, setImage] = useState(null); // the picked image asset
  const [result, setResult] = useState(null); // JSON from Flask
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Open the photo library and remember the choice
  const pickImage = async () => {
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      preferredAssetRepresentationMode:
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
    });
    if (!picked.canceled) {
      setImage(picked.assets[0]);
      setResult(null);
      setError(null);
    }
  };

  // Send it to Flask
  const uploadImage = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", new File(image.uri));

    // Give up after 30 seconds instead of spinning forever
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${API_URL}/extract-text`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      const data = await response.json();
      setResult(data);
    } catch (e) {
      setError("Could not reach the server: " + e.message);
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  // Show the pieces separately
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader title="Image Upload" onBack={() => {}} />
      <LanguageBar source={result?.language} target="en" />

      <CaptureBox
        icon="image-outline"
        label="Tap to add an image"
        onPress={pickImage}
        disabled={loading}
      >
        {image && <Image source={{ uri: image.uri }} style={styles.preview} />}
      </CaptureBox>

      {image && (
        <PrimaryButton
          title="Extract & translate"
          onPress={uploadImage}
          disabled={loading}
        />
      )}
      {loading && <ActivityIndicator size="large" style={styles.gap} />}
      {error && <Text style={styles.error}>{error}</Text>}
      {result && (
        <>
          <TextBox label={languageName(result.language)} text={result.text} />
          <TextBox2 label="English Translation" text={result.translation} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 80, alignItems: "stretch", gap: 16 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  preview: { width: "100%", height: "100%", resizeMode: "contain" },
  gap: { marginTop: 16 },
  error: { color: "red" },
  results: { gap: 6, marginTop: 8 },
  label: { fontWeight: "bold", marginTop: 8 },
});
