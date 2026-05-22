import os
import google.generativeai as genai

def setup_gemini():
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        genai.configure(api_key=api_key)

class GeminiService:
    @staticmethod
    def get_recommendations(channel_context):
        setup_gemini()
        # uses Gemini 1.5 Pro
        model = genai.GenerativeModel('gemini-1.5-pro')
        prompt = f"Based on this YouTube channel data, give 3 video ideas and strategic advice:\n{channel_context}"
        response = model.generate_content(prompt)
        return response.text
        
    @staticmethod
    def chat(messages):
        setup_gemini()
        # uses Gemini 1.5 Flash
        model = genai.GenerativeModel('gemini-1.5-flash')
        # format messages appropriately
        prompt = messages[-1].get('content', '') if messages else ''
        response = model.generate_content(prompt)
        return response.text
