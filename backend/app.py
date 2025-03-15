import time
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS
from google.cloud import vision
import io

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load AssemblyAI API Key
API_KEY = os.getenv('ASSEMBLYAI_API_KEY')

if not API_KEY:
    print("❌ Error: ASSEMBLYAI_API_KEY is missing! Add it in .env file.")
else:
    print("✅ ASSEMBLYAI_API_KEY loaded successfully.")

# Set up Google Cloud Vision API
GOOGLE_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

if not GOOGLE_CREDENTIALS or not os.path.exists(GOOGLE_CREDENTIALS):
    print("❌ Error: GOOGLE_APPLICATION_CREDENTIALS is missing or incorrect! Check .env file.")
else:
    print("✅ GOOGLE_APPLICATION_CREDENTIALS loaded successfully.")

# Ensure the Google Application Credentials are set
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GOOGLE_CREDENTIALS

# Initialize Google Cloud Vision API client
client = vision.ImageAnnotatorClient()

stored_text = ""  # Global variable to store text from frontend

# --- Home Route ---
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Translator API!", "stored_text": stored_text})

# --- Store Text from Frontend ---
@app.route('/api/store-text', methods=['POST'])
def store_text():
    global stored_text
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    stored_text = data["text"]
    print(f"✅ Received Text from Frontend: {stored_text}")  # Debugging

    return jsonify({"message": "Text stored successfully", "stored_text": stored_text})

# --- Transcribe Audio File ---
@app.route('/api/transcribe-audio', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    headers = {'authorization': API_KEY}
    upload_url = 'https://api.assemblyai.com/v2/upload'

    try:
        # Step 1: Upload audio file
        response = requests.post(upload_url, headers=headers, files={'file': file})
        response.raise_for_status()
        audio_url = response.json().get('upload_url')

        # Step 2: Request Transcription
        transcript_url = 'https://api.assemblyai.com/v2/transcript'
        transcript_request = {'audio_url': audio_url}
        transcript_response = requests.post(transcript_url, headers=headers, json=transcript_request)
        transcript_response.raise_for_status()
        transcription_id = transcript_response.json().get('id')

        # Step 3: Check Transcription Status
        status_url = f'https://api.assemblyai.com/v2/transcript/{transcription_id}'
        retries = 20  # Retry limit

        while retries > 0:
            status_response = requests.get(status_url, headers=headers)
            status_response.raise_for_status()
            status_data = status_response.json()

            if status_data['status'] == 'completed':
                return jsonify({'text': status_data['text']})
            elif status_data['status'] == 'failed':
                return jsonify({'error': 'Transcription failed'}), 500

            time.sleep(5)  # Wait before checking again
            retries -= 1

        return jsonify({'error': 'Transcription timed out'}), 504

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

# --- Extract Text from Image using Google Cloud Vision ---
@app.route('/api/extract-text', methods=['POST'])
def extract_text():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Read image file
        content = file.read()
        image = vision.Image(content=content)

        # Request text detection
        response = client.text_detection(image=image)
        
        if response.error.message:
            return jsonify({'error': f"Google Vision API Error: {response.error.message}"}), 500

        texts = response.text_annotations
        extracted_text = texts[0].description if texts else "No text found"

        print(f"✅ Extracted Text: {extracted_text}")  # Debugging
        return jsonify({'extracted_text': extracted_text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- Run the Flask App ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Change port if needed.
