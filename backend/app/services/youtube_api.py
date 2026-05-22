import os
from googleapiclient.discovery import build
from ..utils.youtube_parser import parse_youtube_identifier

def get_youtube_service():
    api_key = os.getenv('YOUTUBE_API_KEY')
    return build('youtube', 'v3', developerKey=api_key)

class YouTubeService:
    @staticmethod
    def get_channel_info(identifier):
        youtube = get_youtube_service()
        parsed = parse_youtube_identifier(identifier)
        
        channel_id = None
        
        if parsed['type'] == 'handle':
            search_request = youtube.search().list(
                q=parsed['value'],
                type="channel",
                part="snippet",
                maxResults=1
            )
            search_response = search_request.execute()
            if not search_response.get('items'):
                return None
            channel_id = search_response['items'][0]['snippet']['channelId']
        elif parsed['type'] == 'channel':
            channel_id = parsed['value']
        elif parsed['type'] == 'video':
            video_req = youtube.videos().list(
                part="snippet",
                id=parsed['value']
            )
            video_resp = video_req.execute()
            if not video_resp.get('items'):
                return None
            channel_id = video_resp['items'][0]['snippet']['channelId']
        else:
            # For custom URLs or unknown formats, try to search it as a fallback
            search_request = youtube.search().list(
                q=parsed['value'],
                type="channel",
                part="snippet",
                maxResults=1
            )
            search_response = search_request.execute()
            if not search_response.get('items'):
                return None
            channel_id = search_response['items'][0]['snippet']['channelId']
            
        request = youtube.channels().list(
            part="snippet,statistics",
            id=channel_id
        )
        response = request.execute()
            
        if not response.get('items'):
            return None
            
        return response['items'][0]
        
    @staticmethod
    def get_videos_batch(video_ids):
        youtube = get_youtube_service()
        # Batch max is 50
        request = youtube.videos().list(
            part="snippet,statistics,contentDetails",
            id=','.join(video_ids[:50])
        )
        response = request.execute()
        return response.get('items', [])
