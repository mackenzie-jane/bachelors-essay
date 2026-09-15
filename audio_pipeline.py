# AssemblyAI Test
# Perform transcription and language detection capabilities (works for both!)
# Free for test environment


# FOR NOTES: 
# test.mp3 - {'text': "I'm hiking up the mountain. I'm like halfway there, probably more than halfway. I have to split up with the crew. There's all these sheep. Okay, this is the hardest thing I've ever done.", 'language': 'en'}
# spanish_audio.mp3 - {'text': 'Papá, tío, vámonos.', 'language': 'es'}
# cat_audio.mp3 - { "language": "en", "text": "Where's my cat?" }

import os
from dotenv import load_dotenv # reads .env file
import assemblyai as aai
from google.cloud import translate_v2 as translate

load_dotenv()
aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")
translate_client = translate.Client()


# function to transcribe and translate audio 
def transcribe_audio(file_path):
    transcriber = aai.Transcriber()
    config = aai.TranscriptionConfig(language_detection=True)
    transcript = transcriber.transcribe(file_path, config=config)

    detected_language = transcript.json_response["language_code"]

    # translate the language
    translation = translate_client.translate(
        transcript.text,
        target_language="en",
        format_="text"
    )

    # clean JSON return
    return{
        "text": transcript.text,
        "language": transcript.json_response["language_code"],
        "translation": translation["translatedText"]
    }

if __name__ == "__main__":
    result = transcribe_audio("audio_samples/spanish_audio.mp3")
    print(result)