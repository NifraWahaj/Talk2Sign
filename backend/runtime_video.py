import json
import os

def get_video_and_frames(gloss_input):
    dataset_path = 'asllvd_dataset_fixed.json'
    
    with open(dataset_path, 'r') as file:
        data = json.load(file)
    
    for entry in data:
        glosses = entry.get('glosses', [])
        if gloss_input in glosses:
            video_file = entry['video_file']
            frames = entry['frames'].get(gloss_input)
            
            if frames:
                start_frame = frames['START_FRAME']
                end_frame = frames['END_FRAME']
                return {
                    'video_file': os.path.join('ASLLVD-videos', video_file),
                    'start_frame': start_frame,
                    'end_frame': end_frame
                }
            else:
                print(f"Gloss '{gloss_input}' exists but frame data missing.")
                return None
    print(f"Gloss '{gloss_input}' not found in dataset.")
    return None

# Example usage
gloss_input = 'WAVE-HELLO'  # Example gloss from your data
result = get_video_and_frames(gloss_input)

if result:
    print("Video Path:", result['video_file'])
    print("Start Frame:", result['start_frame'])
    print("End Frame:", result['end_frame'])
