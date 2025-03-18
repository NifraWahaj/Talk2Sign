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

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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

# --- Run the Flask App ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Change port if needed.
