# backend/app.py
from flask import Flask, request, jsonify, send_file
from inference import generate_asl_gloss, load_model_and_tokenizer
import subprocess, os, json, torch

app = Flask(__name__)

# Load model
model_path = "final_text_to_gloss_model"
tokenizer, model = load_model_and_tokenizer(model_path)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Load dataset for gloss-to-video mapping
with open("asllvd_dataset_fixed.json") as f:
    dataset = json.load(f)

video_dir = "ASLLVD-videos"
clip_dir = "extracted_clips"
os.makedirs(clip_dir, exist_ok=True)
FPS = 30

def extract_clip(gloss, index):
    for entry in dataset:
        if gloss in entry["frames"]:
            video_file = os.path.join(video_dir, entry["video_file"])
            start = entry["frames"][gloss]["START_FRAME"] / FPS
            end = entry["frames"][gloss]["END_FRAME"] / FPS
            out_path = os.path.join(clip_dir, f"{index}_{gloss}.mp4")

            subprocess.run([
                "ffmpeg", "-i", video_file,
                "-ss", str(start), "-to", str(end),
                "-c:v", "libx264", "-y", out_path
            ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            return out_path
    return None

def stitch_clips(clips, output_file):
    list_path = os.path.join(clip_dir, "concat_list.txt")
    with open(list_path, "w") as f:
        for clip in clips:
            f.write(f"file '{clip}'\n")

    subprocess.run([
        "ffmpeg", "-f", "concat", "-safe", "0",
        "-i", list_path, "-c", "copy", output_file
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

@app.route("/api/store-text", methods=["POST"])
def handle_text():
    data = request.get_json()
    input_text = data.get("text", "")
    if not input_text:
        return jsonify({"error": "No text provided"}), 400

    # Generate gloss
    gloss = generate_asl_gloss(tokenizer, model, input_text, device)
    glosses = gloss.strip().split()

    # Extract clips
    clips = []
    for i, g in enumerate(glosses):
        clip_path = extract_clip(g, i)
        if clip_path:
            clips.append(clip_path)

    if not clips:
        return jsonify({"error": "No clips extracted"}), 404

    # Stitch clips
    final_output = os.path.join(clip_dir, "final_output.mp4")
    stitch_clips(clips, final_output)

    return jsonify({
        "translated_text": gloss,
        "video_url": "/api/video"
    })

@app.route("/api/video")
def get_video():
    return send_file(os.path.join(clip_dir, "final_output.mp4"), mimetype="video/mp4")

if __name__ == "__main__":
    app.run(debug=True)
