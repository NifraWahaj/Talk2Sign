import os
import json
from google.cloud import vision
from difflib import SequenceMatcher
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Verify the GOOGLE_APPLICATION_CREDENTIALS environment variable
GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not GOOGLE_APPLICATION_CREDENTIALS:
    print("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.")
    exit(1)
print(f"GOOGLE_APPLICATION_CREDENTIALS: {GOOGLE_APPLICATION_CREDENTIALS}")

# Load ground truth data
GROUND_TRUTH_FILE = "ground_truth.json"
if os.path.exists(GROUND_TRUTH_FILE):
    with open(GROUND_TRUTH_FILE, "r") as f:
        ground_truth = json.load(f)
else:
    print("Ground truth file not found.")
    exit(1)

# Initialize Google Cloud Vision API client
vision_client = vision.ImageAnnotatorClient()

# Directory containing images
IMAGES_DIR = "images"

# Initialize variables to calculate average accuracy
total_accuracy = 0
image_count = 0

# Process each image in the directory
for image_file in os.listdir(IMAGES_DIR):
        image_path = os.path.join(IMAGES_DIR, image_file)
        with open(image_path, "rb") as image_file_obj:
            content = image_file_obj.read()
            image = vision.Image(content=content)
            response = vision_client.text_detection(image=image)
            if response.error.message:
                print(f"Error processing {image_file}: {response.error.message}")
                continue

            texts = response.text_annotations
            extracted_text = texts[0].description if texts else "No text found"

            # Get the expected text for the given file name
            expected_text = ground_truth.get(image_file)
            if not expected_text:
                print(f"Ground truth data not found for {image_file}.")
                continue

            # Normalize text for comparison
            extracted_text = extracted_text.lower().replace("\n", " ").strip()
            expected_text = expected_text.lower().replace("\n", " ").strip()

            # Calculate accuracy
            similarity_ratio = SequenceMatcher(None, extracted_text, expected_text).ratio()
            accuracy = similarity_ratio * 100

            # Print the results
            print(f"Image: {image_file}")
            print(f"Extracted Text: {extracted_text}")
            print(f"Expected Text: {expected_text}")
            print(f"Accuracy: {accuracy:.2f}%")
            print("-" * 50)

            # Accumulate accuracy for average calculation
            total_accuracy += accuracy
            image_count += 1

# Calculate and print average accuracy
if image_count > 0:
    average_accuracy = total_accuracy / image_count
    print(f"Average Accuracy: {average_accuracy:.2f}%")
else:
    print("No images processed.")