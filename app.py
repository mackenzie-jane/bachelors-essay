# using flask since it is a lightweight web framework used to build web applications and backend APIs
# provides URL routing, handling HTTP requests, generating responses, and template rendering 

# CURRENT PROBLEM(ISH): for accents, it returns code in Unicode character sequences
# TO run: python app.py, and then in a separate terminal: curl -X POST -F "audio=@audio_samples/AUDIONAME.mp3" http://127.0.0.1:5000/transcribe

from flask import Flask, request, jsonify
from test_assemblyai import transcribe_audio
import os

app = Flask(__name__)

# route detector tells Flask which URL should trigger our function
# This functionr returns the message we want to see (transcribed audio)
@app.route("/transcribe", methods=["POST"])
def transcribe_endpoint():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    # marks/saves our audio file
    audio_file = request.files["audio"]
    temp_path = "temp_" + audio_file.filename
    audio_file.save(temp_path)

    # transcribes the audio file
    result = transcribe_audio(temp_path)

    os.remove(temp_path)  # clean up after processing
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)