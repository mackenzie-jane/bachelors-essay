from dotenv import load_dotenv
from google.cloud import translate_v2 as translate

load_dotenv()

client = translate.Client()

result = client.translate("Papá, tío, vámonos.", target_language="en", format_="text")
print(result["translatedText"])