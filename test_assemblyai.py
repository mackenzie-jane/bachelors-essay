# AssemblyAI Test
# Perform transcription and language detection capabilities (works for both!)
# Free for test environment
import os
from dotenv import load_dotenv
import assemblyai as aai

load_dotenv()
aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")

transcriber = aai.Transcriber()
config = aai.TranscriptionConfig(language_detection=True)
# transcript = transcriber.transcribe("spanish_audio.mp3", config=config)
# transcript = transcriber.transcribe("cat_audio.mp3", config=config)
transcript = transcriber.transcribe("test.mp3", config=config)


print(transcript.text)
print(transcript.json_response["language_code"])