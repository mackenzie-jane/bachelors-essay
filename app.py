# using flask since it is a lightweight web framework used to build web applications and backend APIs
# provides URL routing, handling HTTP requests, generating responses, and template rendering 

# CURRENT PROBLEM(ISH): for accents, it returns code in Unicode character sequences

# TO run: python app.py
# Then in a separate terminal: 
# AUDIO: curl -X POST -F "audio=@audio_samples/AUDIONAME.mp3" http://127.0.0.1:5000/transcribe
# IMAGE: curl -X POST -F "image=@image_samples/IMAGENAME.mp3" http://127.0.0.1:5000/extract-text

from flask import Flask, request, jsonify
from audio_pipeline import transcribe_audio
from visual_pipeline import extract_text
import os

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

# route detector tells Flask which URL should trigger our function
# This function returns the message we want to see (transcribed audio)
@app.route("/transcribe", methods=["POST"])
def transcribe_endpoint():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    # marks/saves our audio file
    audio_file = request.files["audio"]
    temp_path = "temp_" + audio_file.filename
    audio_file.save(temp_path)

    # transcribes and translates the audio file
    result = transcribe_audio(temp_path)

    os.remove(temp_path)  # clean up after processing
    return jsonify(result)

# route detector tells Flask which URL should trigger our function
# This function returns the message we want to see (transcribed text)
@app.route("/extract-text", methods=["POST"])
def extract_text_endpoint():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    # marks/saves our image file
    image_file = request.files["image"]
    temp_path = "temp_" + image_file.filename
    image_file.save(temp_path)

    # extracts the text from the image file
    result = extract_text(temp_path)

    os.remove(temp_path) # clean up after processing
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)