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
from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
from flask import send_from_directory
import subprocess
import math
import os
from flask import send_from_directory

# ───────────────────────────────────────────────────────────────────────────────
# ───SET UP───────────────────────────────────────────────────────────────────────
# ────────────────────────────────────────────────────────────────────────────────
# Load environment variables
load_dotenv()
# Initialize Flask App
app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",  # Allow all origins for testing
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
#  AssemblyAI API Key
ASSEMBLYAI_API_KEY = os.getenv('ASSEMBLYAI_API_KEY')
print("ASSEMBLYAI_API_KEY:", ASSEMBLYAI_API_KEY)

if not ASSEMBLYAI_API_KEY:
    print("❌ Error: ASSEMBLYAI_API_KEY is missing! Add it in .env file.")
else:
    print("✅ ASSEMBLYAI_API_KEY loaded successfully.")

# Get Google Cloud Credentials
GOOGLE_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if GOOGLE_CREDENTIALS:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GOOGLE_CREDENTIALS

# Initialize Google Cloud Vision API client
vision_client = vision.ImageAnnotatorClient()
translator = GoogleTranslator(source='auto', target='en')

stored_text = ""
stored_subtitles = ""
# ────────────────────────────────────────────────────────────────────────────────
# ───Transcribe Audio File────────────────────────────────────────────────────────
# ────────────────────────────────────────────────────────────────────────────────
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
                print("❌ Transcription failed. Check your internet connection.")
                return jsonify({'error': 'Transcription failed. Check your internet connection.'}), 500

            time.sleep(5)  # Wait before checking again
            retries -= 1

        return jsonify({'error': 'Transcription timed out'}), 504

    except requests.exceptions.RequestException as e:
        print(f"❌ Error during transcription: {e}")
        return jsonify({'error': str(e)}), 500
    
# ────────────────────────────────────────────────────────────────────────────────
# ───home────────────────────────────────────────────────────────
# ────────────────────────────────────────────────────────────────────────────────
@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to the Translator API!',
        "stored_text": stored_text,
        "latest_subtitles": stored_subtitles
    })


# ───────────────────────────────────────────────────────────────────────────────
# ───model inference               ──────────────────────────────────────────────
# ────────────────────────────────────────────────────────────────────────────────
# Load the model and tokenizer
model_path = "final_text_to_gloss_model"
tokenizer = T5Tokenizer.from_pretrained(model_path)
model = T5ForConditionalGeneration.from_pretrained(model_path)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def generate_asl_gloss(tokenizer, model, input_text, device):
    # Add task prefix
    input_text = f"translate English to ASL: {input_text}"
    
    # Preprocess the input text
    input_ids = tokenizer.encode(input_text, return_tensors="pt").to(device)
    
    # Generate the ASL gloss with improved parameters
    output = model.generate(
        input_ids,
        max_length=64,
        num_beams=4,
        early_stopping=True,
        no_repeat_ngram_size=2,
        repetition_penalty=2.0,
    )
    
    asl_gloss = tokenizer.decode(output[0], skip_special_tokens=True)
    return asl_gloss


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


    # Generate ASL gloss
    asl_gloss = generate_asl_gloss(tokenizer, model, original_text, device)
    
    # Print the gloss to the console
    print(f"Input Text: {original_text}")
    print(f"ASL Gloss: {asl_gloss}")
    
    return jsonify({"message": "Text stored successfully", "original_text": original_text, "translated_text": translated_text})


# --- Extract Text from Image using Google Cloud Vision ---

# ───────────────────────────────────────────────────────────────────────────────
# ───Google Vision API──────────────────────────────────────────────
# ────────────────────────────────────────────────────────────────────────────────
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
    
# ───────────────────────────────────────────────────────────────────────────────
# ───Extract YouTube Video Subtitles──────────────────────────────────────────────
# ────────────────────────────────────────────────────────────────────────────────

def extract_video_id(url):
    # Extract YouTube video ID from URL
    regex = r'(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})'
    match = re.search(regex, url)
    return match.group(1) if match else None

@app.route('/api/transcript', methods=['POST', 'OPTIONS'])
def get_transcript():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
    
    data = request.json
    youtube_url = data.get('url')
    
    if not youtube_url:
        return jsonify({'error': 'No URL provided'}), 400
    
    video_id = extract_video_id(youtube_url)
    if not video_id:
        return jsonify({'error': 'Invalid YouTube URL'}), 400
    
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return jsonify({
            'videoId': video_id,
            'transcript': transcript
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ────────────────────────────────────────────────────────────────────────────────
# ───TEXT TO GLOSS PIPELINE───────────────────────────────────────────────────────
# ────────────────────────────────────────────────────────────────────────────────

# 1. CONFIG
FPS = 30000/1001.0  # ≈29.97 fps
BASE_DIR     = os.path.dirname(__file__)
VIDEO_DIR    = os.path.join(BASE_DIR, 'ASLLVD-videos')
CLIP_DIR     = os.path.join(BASE_DIR, 'extracted_clips')
OUTPUT_DIR   = os.path.join(BASE_DIR, 'output')
MAPPING_FILE = os.path.join(BASE_DIR, 'asllvd_dataset_fixed.json')

# load mapping JSON
with open(MAPPING_FILE, 'r') as f:
    mapping_list = json.load(f)

gloss_map = {}
for entry in mapping_list:
    vf = entry['video_file']
    for gloss in entry['glosses']:
        if gloss not in gloss_map:
            fr = entry['frames'][gloss]
            gloss_map[gloss] = {
                'video_file': vf,
                'start_frame': int(fr['START_FRAME']),
                'end_frame':   int(fr['END_FRAME'])
            }

# ensure directories exist
os.makedirs(CLIP_DIR,   exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

import re
def slugify(gloss):
    return re.sub(r'[^\w\-]', '_', gloss)

def match_glosses(gloss_string):
    tokens, i = [], 0
    parts = gloss_string.split()
    while i < len(parts):
        match = None
        for j in range(len(parts), i, -1):
            cand = " ".join(parts[i:j])
            if cand in gloss_map:
                match = cand
                break
        if not match and parts[i] in gloss_map:
            match = parts[i]
        if match:
            tokens.append(match)
            i += len(match.split())
        else:
            i += 1
    return tokens
# ────────────────────────────────────────────────────────────────────────────────
# ───TEXT TO GLOSS PIPELINE───────────────────────────────────────────────────────
# ────────────────────────────────────────────────────────────────────────────────

import re

@app.route('/api/generate-video', methods=['POST'])
def generate_video():
    # 1) clear previous clips/output
    for f in os.listdir(CLIP_DIR):
        if f.endswith('.mp4'):
            os.remove(os.path.join(CLIP_DIR, f))
    stitched_fp = os.path.join(OUTPUT_DIR, 'stitched_output.mp4')
    if os.path.exists(stitched_fp):
        os.remove(stitched_fp)

    # 2) get user text
    data = request.get_json() or {}
    text = data.get('text', '').strip()
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # 3) word-by-word gloss generation & clip extraction
    words = re.findall(r"[A-Za-z']+", text)
    clip_files = []
    for wi, word in enumerate(words):
        gloss_str = generate_asl_gloss(tokenizer, model, word, device)
        tokens = match_glosses(gloss_str)
        print(f"Word '{word}' → gloss '{gloss_str}' → tokens {tokens}")
        for ti, g in enumerate(tokens):
            info = gloss_map.get(g)
            if not info:
                print(f"⚠️ no mapping for {g}")
                continue
            s = info['start_frame'] / FPS
            d = (info['end_frame'] - info['start_frame'] + 1) / FPS
            safe = re.sub(r'[^\w\-]', '_', g)
            out_clip = os.path.join(CLIP_DIR, f"{wi}_{ti}_{safe}.mp4")

            subprocess.run([
                'ffmpeg','-y',
                '-ss', f"{s:.3f}",
                '-i', os.path.join(VIDEO_DIR, info['video_file']),
                '-t', f"{d:.3f}",
                '-c','copy',
                out_clip
            ], check=True)
            clip_files.append(out_clip)

    # 4) build concat list
    concat_txt = os.path.join(BASE_DIR, 'concat_list.txt')
    with open(concat_txt, 'w') as f:
        for c in clip_files:
            f.write(f"file '{c}'\n")

    # 5) stitch clips
    subprocess.run([
        'ffmpeg','-y','-f','concat','-safe','0',
        '-i', concat_txt,
        '-c','copy',
        stitched_fp
    ], check=True)

    # 6) pad & slow 2×
    slow_fp = os.path.join(OUTPUT_DIR, 'stitched_slow.mp4')
    subprocess.run([
        'ffmpeg','-y','-i', stitched_fp,
        '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2,setpts=2*PTS',
        '-c:v','libx264','-preset','fast',
        slow_fp
    ], check=True)

    # 7) return URL for frontend
    return jsonify({'video_url': f"/video/stitched_slow.mp4"})

@app.route('/video/<filename>')
def get_video(filename):
    # serve from your OUTPUT_DIR
    return send_from_directory(OUTPUT_DIR, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555, debug=True) 