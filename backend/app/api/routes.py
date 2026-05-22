from flask import Blueprint, request, jsonify
from ..services.youtube_api import YouTubeService
from ..services.gemini_api import GeminiService
from ..services.analytics import AnalyticsService
from ..models.cache import APICache
import traceback

api_bp = Blueprint('api', __name__)

@api_bp.route('/channel/<path:identifier>', methods=['GET'])
def get_channel(identifier):
    cache_key = f"channel_{identifier}"
    cached = APICache.get_cached(cache_key)
    if cached:
        return jsonify(cached)
        
    try:
        channel_data = YouTubeService.get_channel_info(identifier)
        if channel_data:
            APICache.set_cache(cache_key, channel_data)
            return jsonify(channel_data)
        return jsonify({'error': 'Channel not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/videos/batch', methods=['POST'])
def get_videos_batch():
    data = request.json
    video_ids = data.get('video_ids', [])
    if not video_ids:
        return jsonify({'error': 'No video IDs provided'}), 400
        
    cache_key = f"videos_{','.join(sorted(video_ids))}"
    cached = APICache.get_cached(cache_key)
    if cached:
        return jsonify(cached)
        
    try:
        videos = YouTubeService.get_videos_batch(video_ids)
        APICache.set_cache(cache_key, videos)
        return jsonify(videos)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/analysis/timing', methods=['POST'])
def analyze_timing():
    data = request.json
    videos = data.get('videos', [])
    stats = AnalyticsService.analyze_timing(videos)
    return jsonify(stats)

@api_bp.route('/analysis/duration', methods=['POST'])
def analyze_duration():
    data = request.json
    videos = data.get('videos', [])
    stats = AnalyticsService.analyze_duration(videos)
    return jsonify(stats)

@api_bp.route('/ai/recommendations', methods=['POST'])
def ai_recommendations():
    data = request.json
    context = data.get('context', '')
    try:
        recommendations = GeminiService.get_recommendations(context)
        return jsonify({'recommendations': recommendations})
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@api_bp.route('/ai/chat', methods=['POST'])
def ai_chat():
    data = request.json
    messages = data.get('messages', [])
    try:
        response = GeminiService.chat(messages)
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
