# Talk2Sign

> Real-time English to American Sign Language translation — text, audio, image, and video input supported.

![React](https://img.shields.io/badge/React-PWA-61DAFB?logo=react&logoColor=white)
![Flask](https://img.shields.io/badge/Backend-Flask-000000?logo=flask)
![PyTorch](https://img.shields.io/badge/Model-PyTorch-EE4C2C?logo=pytorch&logoColor=white)
![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28?logo=firebase&logoColor=black)

---

## What is Talk2Sign?

Talk2Sign is a Progressive Web App that translates English into American Sign Language. It accepts text, audio, images, and YouTube video as input, converts them to ASL gloss using a fine-tuned T5 model, then stitches together real ASLLVD video clips into a continuous ASL output — all from the browser.

Built as a Final Year Project to improve multimedia accessibility for Deaf and Hard-of-Hearing users.

---

## How It Works

```
Input (text / audio / image / YouTube)
        ↓
   Flask Backend
        ↓
  T5 Gloss Model
        ↓
 ASLLVD Video Lookup
        ↓
  FFmpeg Video Stitch
        ↓
   ASL Video Output
```

- **Speech** is transcribed via AssemblyAI ASR  
- **Images** are parsed via Google Vision OCR  
- **YouTube** captions are pulled via YouTube Subtitles API  
- **Auth** is handled by Firebase Authentication

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (PWA) |
| Backend | Flask (Python) |
| ML Model | T5-Base (fine-tuned) |
| Video Processing | FFmpeg |
| Auth | Firebase |
| ASR | AssemblyAI |
| OCR | Google Vision API |

---

## Getting Started

### Prerequisites

- Node.js ≥ 16
- Python ≥ 3.8
- FFmpeg installed and on PATH
- Firebase project configured
- AssemblyAI and Google Vision API keys

---

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/src` directory:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

```bash
npm start
```

App runs at `http://localhost:3000`

---

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

API runs at `http://localhost:5000`

---

## Future Work

- Domain-specific datasets (medical, legal)
- Offline PWA support for low-connectivity scenarios
- Larger gloss-video corpora with transfer learning for improved accuracy

---

## Team

| Name | GitHub |
|---|---|
| Nifra Wahaj | [@nifrawahaj](https://github.com/nifrawahaj) |
| Rubina Noor | [@rubinanoor](https://github.com/rubinanoor)|
| Aman Zeeshan | [@amanzeeshan](https://github.com/AmanZeeshan)|

---
