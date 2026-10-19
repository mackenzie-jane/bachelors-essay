import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { fetch } from "expo/fetch";
import { File } from "expo-file-system";

const API_URL = "http://10.5.130.59:5001";

export default function App() {
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

  // Step 4: send it to Flask
  const uploadImage = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", new File(image.uri));

    try {
      const response = await fetch(`${API_URL}/extract-text`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (e) {
      setError("Could not reach the server: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 5: show the pieces separately
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Language Detector</Text>

      <Button title="Choose an image" onPress={pickImage} />

      {image && (
        <>
          <Image source={{ uri: image.uri }} style={styles.preview} />
          <Button title="Extract & translate" onPress={uploadImage} />
        </>
      )}

      {loading && <ActivityIndicator size="large" style={styles.gap} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {result && <Text selectable>{JSON.stringify(result, null, 2)}</Text>}
      {result && (
        <View style={styles.results}>
          <Text style={styles.label}>Detected language</Text>
          <Text>{result.language ?? "—"}</Text>
          <Text style={styles.label}>Original text</Text>
          <Text>{result.text ?? result.message ?? "—"}</Text>
          <Text style={styles.label}>Translation</Text>
          <Text>{result.translation ?? "—"}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 80, alignItems: "stretch", gap: 16 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  preview: { width: "100%", height: 250, resizeMode: "contain" },
  gap: { marginTop: 16 },
  error: { color: "red" },
  results: { gap: 6, marginTop: 8 },
  label: { fontWeight: "bold", marginTop: 8 },
});
