import os
import google.generativeai as genai

def setup_gemini():
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        print("GEMINI KEY:", os.getenv("GEMINI_API_KEY"))
        genai.configure(api_key=api_key)

class GeminiService:
    @staticmethod
    def get_recommendations(channel_context):
        setup_gemini()
        # uses Gemini 1.5 Flash
        model = genai.GenerativeModel("models/gemini-2.5-flash")
        prompt = f"""
        Act as an elite YouTube Strategist. Based on the following channel data, generate a highly structured strategic report using Markdown.
        
        Requirements:
        1. Content Recommendations: Suggest 3 specific, highly-engaging video ideas based on the channel's niche.
        2. Suggested Upload Timings: Recommend the best days and times to upload for maximum early velocity.
        3. Video Duration Strategy: Suggest the optimal video length (e.g. Shorts vs 8-min vs 20-min) to maximize retention and algorithm promotion.
        4. Category Strategy: Identify the best performing content themes.
        
        Make the response extremely professional, insightful, and formatted with Markdown headings (H3/H4), bold text, and bullet points. Do not include a generic introduction.
        
        Channel Context:
        {channel_context}
        """
        response = model.generate_content(prompt)
        return response.text
        
    @staticmethod
    def chat(messages):
        setup_gemini()
        # uses Gemini 1.5 Flash
        model = genai.GenerativeModel('gemini-2.5-flash')
        # format messages appropriately
        prompt = messages[-1].get('content', '') if messages else ''
        response = model.generate_content(prompt)
        return response.text
