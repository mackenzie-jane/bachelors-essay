import { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
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
import { colors } from "../theme";

import ScreenHeader from "./ScreenHeader";
import LanguageBar from "./LanguageBar";
import PrimaryButton from "./PrimaryButton";
import CaptureBox from "./CaptureBox";
import TextBox from "./TextBox";
import TextBox2 from "./TextBox2";
import { languageName } from "../languages";

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

  const uploadAudio = async () => {
    if (!recordingUri) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("audio", new File(recordingUri));

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

  const micLabel = recorderState.isRecording
    ? "Recording… tap to stop"
    : recordingUri
      ? "Tap to record again"
      : "Tap to start recording";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader title="Audio Upload" onBack={() => {}} />
      <LanguageBar source={result?.language} target="en" />

      <CaptureBox
        icon={recorderState.isRecording ? "stop-circle" : "mic-outline"}
        iconColor={recorderState.isRecording ? colors.error : undefined}
        label={micLabel}
        active={recorderState.isRecording}
        onPress={recorderState.isRecording ? stopRecording : record}
        disabled={loading}
      />

      {recordingUri && (
        <PrimaryButton
          title="Transcribe & translate"
          onPress={uploadAudio}
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
  gap: { marginTop: 16 },
  error: { color: "red" },
});
