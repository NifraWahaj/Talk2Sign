import subprocess
import os
import json

# Paths
video_dir = 'ASLLVD-videos'
output_dir = 'extracted_clips'
json_file = 'asllvd_dataset_fixed.json'

os.makedirs(output_dir, exist_ok=True)

# Load ground truth JSON
with open(json_file, 'r') as f:
    data = json.load(f)

# Take glosses as comma-separated input
input_glosses = input("ASL Gloss (comma-separated): ").strip().split(',')

# Clean whitespace
input_glosses = [gloss.strip() for gloss in input_glosses]

for gloss in input_glosses:
    found = False
    for entry in data:
        video_file = os.path.join(video_dir, entry['video_file'])
        frames = entry['frames']
        
        if gloss in frames:
            start_frame = int(frames[gloss]['START_FRAME'])
            end_frame = int(frames[gloss]['END_FRAME'])
            output_clip = os.path.join(output_dir, f"{entry['video_file'].split('.')[0]}_{gloss}.mp4")
            
            # Extract frames using ffmpeg
            ffmpeg_cmd = [
                'ffmpeg',
                '-i', video_file,
                '-vf', f"select='between(n\\,{start_frame}\\,{end_frame})',setpts=N/FRAME_RATE/TB",
                '-vsync', '0',
                output_clip
            ]
            subprocess.run(ffmpeg_cmd)
            print(f"Extracted {gloss} → {output_clip}")
            found = True
            break  # remove break if you want to search same gloss in multiple videos
    if not found:
        print(f"Gloss '{gloss}' not found in dataset.")

# now stiching them together
# Stitch extracted clips in gloss order
stitched_video = 'output/stitched_output.mp4'
os.makedirs('output', exist_ok=True)

# Prepare list of clips in correct gloss order
with open('concat_list.txt', 'w') as f:
    for gloss in input_glosses:
        for entry in data:
            clip_path = os.path.join(output_dir, f"{entry['video_file'].split('.')[0]}_{gloss}.mp4")
            if os.path.exists(clip_path):
                f.write(f"file '{clip_path}'\n")
                break  # Use first match only

# Run ffmpeg concat
ffmpeg_concat_cmd = [
    'ffmpeg',
    '-f', 'concat',
    '-safe', '0',
    '-i', 'concat_list.txt',
    '-c', 'copy',
    stitched_video
]
subprocess.run(ffmpeg_concat_cmd)
print(f"\n✅ Stitched video saved at: {stitched_video}")
