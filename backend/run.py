import os
import sys
from dotenv import load_dotenv

load_dotenv()

# Validate API keys
youtube_key = os.getenv('YOUTUBE_API_KEY')
print("YOUTUBE KEY:",youtube_key)
gemini_key = os.getenv('GEMINI_API_KEY')

if not youtube_key or youtube_key == 'your_youtube_api_key_here':
    print("ERROR: YOUTUBE_API_KEY is missing or invalid in .env file.", file=sys.stderr)
    sys.exit(1)

if not gemini_key or gemini_key == 'your_gemini_api_key_here':
    print("ERROR: GEMINI_API_KEY is missing or invalid in .env file.", file=sys.stderr)
    sys.exit(1)

from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
