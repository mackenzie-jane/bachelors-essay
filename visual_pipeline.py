# VisionAI Test
# Performs vision capabilities
# Free for test environment but I think the payment plan is a bit funky

# to run: source venv/bin/activate then python visual_pipeline.py
# change the image file name in main to see any different images

# Current challenges: Multiple text regions on one page (book cover problem)

import os
from dotenv import load_dotenv # reads .env file
from google.cloud import vision

load_dotenv() 

client = vision.ImageAnnotatorClient()

def extract_text(file_path):
    with open(file_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if response.error.message:
        return {"text": None, "error": response.error.message}
    if texts:
        return {"text": texts[0].description}
    else: 
        return {"text": None, "message": "No text detected in this image"}

def print_clean(result):
    print(result.get("text", ""))

if __name__ == "__main__":
    result = extract_text("image_samples/test_image_2.jpg")
    print_clean(result)
    #print(result)