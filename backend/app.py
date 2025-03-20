import time
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS
from google.cloud import vision
import io
import youtube_transcript_api
from youtube_transcript_api import YouTubeTranscriptApi
import json
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
    
# Get Google Cloud Credentials
GOOGLE_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

if not GOOGLE_CREDENTIALS or not os.path.exists(GOOGLE_CREDENTIALS):
    print("\u274c Error: GOOGLE_APPLICATION_CREDENTIALS is missing or incorrect! Check .env file.")
else:
    print("\u2705 GOOGLE_APPLICATION_CREDENTIALS loaded successfully.")

# Ensure Google Application Credentials are set
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GOOGLE_CREDENTIALS

# Initialize Google Cloud Vision API client
vision_client = vision.ImageAnnotatorClient()

stored_text = ""  # Global variable to store text from frontend

# --- Home Route ---
@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to the Translator API!',
        "stored_text": stored_text,
        "latest_subtitles": stored_subtitles  # Show the latest fetched subtitles
    })

# --- Store Text from Frontend ---
@app.route('/api/store-text', methods=['POST'])
def store_text():
    global stored_text
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    stored_text = data["text"]
    print(f"\u2705 Received Text from Frontend: {stored_text}")  # Debugging

    return jsonify({"message": "Text stored successfully", "stored_text": stored_text})


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

# --- Extract Text from Image using Google Cloud Vision ---
@app.route('/api/extract-text', methods=['POST'])
def extract_text():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file_name not in ground_truth:
        return jsonify({'error': 'No ground truth available for this file'}), 400

    
    try:
        # Read image file
        content = file.read()
        image = vision.Image(content=content)

        # Request text detection
        response = vision_client.text_detection(image=image)

        if response.error.message:
            return jsonify({'error': f"Google Vision API Error: {response.error.message}"}), 500

        texts = response.text_annotations
        extracted_text = texts[0].description if texts else "No text found"
        print(f"✅ Extracted Text: {extracted_text}")  # Debugging
        return jsonify({'extracted_text': extracted_text})

    except Exception as e:
        print(f"❌ Google Cloud Vision Error: {e}")
        return jsonify({'error': str(e)}), 500
        
        
    
# --- Extract YouTube Video Subtitles ---
# Add this at the top of the file
stored_subtitles = ""  # Global variable to store subtitles

@app.route('/api/get-youtube-subtitles', methods=['POST'])
def get_youtube_subtitles():
    global stored_subtitles
    data = request.get_json()
    if not data or "video_url" not in data:
        return jsonify({"error": "No video URL provided"}), 400
    
    video_url = data["video_url"]
    video_id = extract_video_id(video_url)
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400
    
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        subtitles = " ".join([entry['text'] for entry in transcript])
        
        stored_subtitles = subtitles  # Store subtitles globally
        print(f"\u2705 Extracted Subtitles:\n{subtitles}")  

        return jsonify({"subtitles": subtitles})
    except youtube_transcript_api._errors.TranscriptsDisabled:
        return jsonify({"error": "Subtitles are disabled for this video"}), 400
    except youtube_transcript_api._errors.NoTranscriptFound:
        return jsonify({"error": "No subtitles found for this video"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Helper function to extract video ID from YouTube URL
def extract_video_id(url):
    import re
    pattern = r"(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})"
    match = re.search(pattern, url)
    return match.group(1) if match else None

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

# --- Run the Flask App ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Change port if needed.