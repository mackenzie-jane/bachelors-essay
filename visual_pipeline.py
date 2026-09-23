# VisionAI Test
# Performs vision capabilities
# Free for test environment but I think the payment plan is a bit funky

# to run: source venv/bin/activate then python visual_pipeline.py
# change the image file name in main to see any different images

# Current challenges: Multiple text regions on one page (book cover problem)

import os
from dotenv import load_dotenv # reads .env file
from google.cloud import vision
from google.cloud import translate_v2 as translate

load_dotenv() 

client = vision.ImageAnnotatorClient()
translate_client = translate.Client()

# function to detect and translate text
def extract_text(file_path):
    with open(file_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if response.error.message:
        return {
            "text": None, 
            "language": None,
            "translation": None,
            "error": response.error.message
        }
    if not texts: 
        return {
            "text": None, 
            "language": None,
            "translation": None,
            "message": "No text detected in this image"
        }
    
    detected_text = texts[0].description
    detected_language = texts[0].locale # vision AI automatically detects the language
    
    # translate the language
    translation = translate_client.translate(
        detected_text,
        target_language="en",
        format_="text"
    )
    
    # clean JSON return
    return{
        "text": detected_text,
        "language": detected_language,
        "translation": translation["translatedText"]
    }

def print_clean(result):
    print("Text: " + result.get("text", ""))
    print("Language: " + result.get("language", ""))
    print("Translation: " + result.get("translation", ""))

def test_cases(final_file):
    result = extract_text(final_file)
    print_clean(result)
    print(result)

if __name__ == "__main__":
    #test_cases("image_samples/test_image_2.jpg")
    #test_cases("image_samples/french_text.jpeg")
    test_cases("image_samples/arabic_text.jpeg")
    