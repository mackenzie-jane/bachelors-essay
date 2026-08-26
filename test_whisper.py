# WhisperAI Test
# Perform transcription
# Has a monthly cost so I was unable to actually test
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

audio_file = open("test.mp3", "rb")

transcript = client.audio.transcriptions.create(
    model="whisper-1",
    file=audio_file
)

print(transcript.text)