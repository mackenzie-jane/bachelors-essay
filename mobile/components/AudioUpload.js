import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";
import { fetch } from "expo/fetch";
import { File } from "expo-file-system";
import { API_URL } from "../config";

export default function AudioUpload() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [recordingUri, setRecordingUri] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const record = async () => {
    setResult(null);
    setError(null);
    setRecordingUri(null);
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
    setRecordingUri(audioRecorder.uri);
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();

      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  // Send the recording to Flask
  const uploadAudio = async () => {
    if (!recordingUri) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("audio", new File(recordingUri));

    // Give up after 30 seconds
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${API_URL}/transcribe`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      setResult(data);
    } catch (e) {
      setError(
        e.name === "AbortError"
          ? "The request timed out after 30 seconds."
          : "Could not reach the server: " + e.message,
      );
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  // Show the pieces separately
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Language Detector- Audio</Text>
      <Button
        title={recorderState.isRecording ? "Stop recording" : "Start recording"}
        onPress={recorderState.isRecording ? stopRecording : record}
      />

      {recordingUri && (
        <Button title="Transcribe & translate" onPress={uploadAudio} />
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
