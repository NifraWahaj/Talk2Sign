import time
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS
from google.cloud import vision
import io
from youtube_transcript_api import YouTubeTranscriptApi
import json
from deep_translator import GoogleTranslator

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get AssemblyAI API Key
ASSEMBLYAI_API_KEY = os.getenv('ASSEMBLYAI_API_KEY')
print("ASSEMBLYAI_API_KEY:", ASSEMBLYAI_API_KEY)

if not ASSEMBLYAI_API_KEY:
    print("❌ Error: ASSEMBLYAI_API_KEY is missing! Add it in .env file.")
else:
    print("✅ ASSEMBLYAI_API_KEY loaded successfully.")



# --- Transcribe Audio File ---
@app.route('/api/transcribe-audio', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    headers = {'authorization': ASSEMBLYAI_API_KEY}
    upload_url = 'https://api.assemblyai.com/v2/upload'

    try:
        print("🔄 Uploading file to AssemblyAI...")
        response = requests.post(upload_url, headers=headers, files={'file': file})
        response.raise_for_status()
        audio_url = response.json().get('upload_url')
        print(f"✅ File uploaded successfully: {audio_url}")

        # Step 2: Request Transcription
        transcript_url = 'https://api.assemblyai.com/v2/transcript'
        transcript_request = {'audio_url': audio_url}
        transcript_response = requests.post(transcript_url, headers=headers, json=transcript_request)
        transcript_response.raise_for_status()
        transcription_id = transcript_response.json().get('id')
        print(f"✅ Transcription requested successfully. ID: {transcription_id}")

        # Step 3: Check Transcription Status
        status_url = f'https://api.assemblyai.com/v2/transcript/{transcription_id}'
        retries = 20  # Retry limit

        while retries > 0:
            print(f"🔍 Checking transcription status... (Attempts left: {retries})")
            status_response = requests.get(status_url, headers=headers)
            status_response.raise_for_status()
            status_data = status_response.json()
            print(f"📝 Current status: {status_data['status']}")

            if status_data['status'] == 'completed':
                print(f"✅ Transcription completed: {status_data['text']}")
                return jsonify({'text': status_data['text']})
            elif status_data['status'] == 'failed':
                print("❌ Transcription failed.")
                return jsonify({'error': 'Transcription failed'}), 500

            time.sleep(5)  # Wait before checking again
            retries -= 1

        return jsonify({'error': 'Transcription timed out'}), 504

    except requests.exceptions.RequestException as e:
        print(f"❌ Error during transcription: {e}")
        return jsonify({'error': str(e)}), 500


# Get Google Cloud Credentials
GOOGLE_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if GOOGLE_CREDENTIALS:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GOOGLE_CREDENTIALS

# Initialize Google Cloud Vision API client
vision_client = vision.ImageAnnotatorClient()
translator = GoogleTranslator(source='auto', target='en')

stored_text = ""
stored_subtitles = ""

@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to the Translator API!',
        "stored_text": stored_text,
        "latest_subtitles": stored_subtitles
    })

@app.route('/api/store-text', methods=['POST'])
def store_text():
    global stored_text
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400
    original_text = data["text"]
    translated_text = translator.translate(original_text)
    stored_text = translated_text
    print(f"🔤 Translated Text: {translated_text}")
    return jsonify({"message": "Text stored successfully", "original_text": original_text, "translated_text": translated_text})

# --- Extract Text from Image using Google Cloud Vision ---
@app.route('/api/extract-text', methods=['POST'])
def extract_text():
    global stored_text
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        content = file.read()
        image = vision.Image(content=content)
        response = vision_client.text_detection(image=image)
        if response.error.message:
            return jsonify({'error': f"Google Vision API Error: {response.error.message}"}), 500
        texts = response.text_annotations
        extracted_text = texts[0].description if texts else "No text found"
        translated_text = translator.translate(extracted_text)
        stored_text = translated_text
        print(f"🔤 Translated Text: {translated_text}")
        return jsonify({'extracted_text': extracted_text, 'translated_text': translated_text, 'stored_text': stored_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
# --- Extract YouTube Video Subtitles ---
@app.route('/api/get-youtube-subtitles', methods=['POST'])
def get_youtube_subtitles():
    global stored_subtitles
    data = request.get_json()
    if not data or "video_url" not in data:
        return jsonify({"error": "No video URL provided"}), 400

    video_id = extract_video_id(data["video_url"])
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        subtitles = " ".join([entry['text'] for entry in transcript])
        stored_subtitles = subtitles
        translated_subtitles = translator.translate(subtitles)
        print(f"🔤 Translated Subtitles: {translated_subtitles}")
        return jsonify({"subtitles": subtitles, "translated_subtitles": translated_subtitles, 'stored_subtitles': stored_subtitles})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ================= TESTING OCR =================
GROUND_TRUTH_FILE = "ground_truth.json"

if os.path.exists(GROUND_TRUTH_FILE):
    with open(GROUND_TRUTH_FILE, "r") as f:
        ground_truth = json.load(f)
else:
    ground_truth = {}

@app.route('/api/store-ground-truth', methods=['POST'])
def store_ground_truth():
    data = request.get_json()
    if "file_name" not in data or "expected_text" not in data:
        return jsonify({"error": "Provide file_name and expected_text"}), 400

    ground_truth[data["file_name"]] = data["expected_text"]

    with open(GROUND_TRUTH_FILE, "w") as f:
        json.dump(ground_truth, f)

    return jsonify({"message": "Ground truth stored successfully!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)