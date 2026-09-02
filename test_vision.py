# VisionAI Test
# Performs vision capabilities
# Free for test environment but I think the payment plan is a bit funky
import os
from dotenv import load_dotenv
from google.cloud import vision

load_dotenv()

client = vision.ImageAnnotatorClient()

with open("image_samples/test_image_2.jpg", "rb") as image_file:
    content = image_file.read()

image = vision.Image(content=content)
response = client.text_detection(image=image)

texts = response.text_annotations
if texts:
    print(texts[0].description)
else:
    print("No text detected.")