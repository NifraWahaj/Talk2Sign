import requests

# Define the backend URL
BACKEND_URL = "http://localhost:8000/api/translate-to-gloss"

# Define the input text
input_text = "Hello, how are you?"

# Send a POST request to the backend
try:
    response = requests.post(
        BACKEND_URL,
        json={"text": input_text},
        headers={"Content-Type": "application/json"},
    )
    response.raise_for_status()  # Raise an error for bad status codes
    print("Translation Response:", response.json())
except requests.exceptions.RequestException as e:
    print("Error making request:", e)