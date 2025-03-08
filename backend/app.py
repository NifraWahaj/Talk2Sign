import time
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
load_dotenv()

API_KEY = os.getenv('ASSEMBLYAI_API_KEY')
print("ASSEMBLYAI_API_KEY:", os.getenv('ASSEMBLYAI_API_KEY'))

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Text Extraction API!'})

@app.route('/api/transcribe-audio', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    headers = {'authorization': API_KEY}
    upload_url = 'https://api.assemblyai.com/v2/upload'

    try:
        response = requests.post(upload_url, headers=headers, files={'file': file})
        response.raise_for_status()
        audio_url = response.json()['upload_url']

        transcript_url = 'https://api.assemblyai.com/v2/transcript'
        transcript_request = {'audio_url': audio_url}
        transcript_response = requests.post(transcript_url, headers=headers, json=transcript_request)
        transcript_response.raise_for_status()
        transcription_id = transcript_response.json()['id']

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

            time.sleep(5)  # Wait before checking the status again
            retries -= 1

        return jsonify({'error': 'Transcription timed out'}), 504

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
