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
            part="snippet,statistics,brandingSettings",
            id=channel_id
        )
        response = request.execute()
            
        if not response.get('items'):
            return None
            
        return response['items'][0]
        
    @staticmethod
    def get_videos_batch(video_ids):
        from .heuristics import AnalyticsHeuristics
        youtube = get_youtube_service()
        # Batch max is 50
        request = youtube.videos().list(
            part="snippet,statistics,contentDetails",
            id=','.join(video_ids[:50])
        )
        response = request.execute()
        items = response.get('items', [])
        
        # Apply heuristics for estimated metrics
        for item in items:
            stats = item.get('statistics', {})
            views = stats.get('viewCount', 0)
            likes = stats.get('likeCount', 0)
            comments = stats.get('commentCount', 0)
            
            stats['estimatedShares'] = AnalyticsHeuristics.estimate_shares(views, likes, comments)
            stats['estimatedSubscriberGain'] = AnalyticsHeuristics.estimate_subscriber_gain(views, likes, comments)
            item['statistics'] = stats
            
        return items

    @staticmethod
    def get_videos_by_date(channel_id, start_date, end_date, max_results=50):
        youtube = get_youtube_service()
        
        # start_date and end_date must be RFC 3339 formatted (e.g., 2023-01-01T00:00:00Z)
        try:
            search_request = youtube.search().list(
                part="id",
                channelId=channel_id,
                type="video",
                publishedAfter=start_date,
                publishedBefore=end_date,
                order="date",
                maxResults=max_results
            )
            search_response = search_request.execute()
            
            video_ids = [item['id']['videoId'] for item in search_response.get('items', []) if item['id'].get('videoId')]
            
            if not video_ids:
                return []
                
            return YouTubeService.get_videos_batch(video_ids)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return []

    @staticmethod
    def get_recent_videos(channel_id, max_results=50):
        youtube = get_youtube_service()
        channel_req = youtube.channels().list(part="contentDetails", id=channel_id)
        channel_resp = channel_req.execute()
        if not channel_resp.get('items'):
            return []
            
        uploads_id = channel_resp['items'][0]['contentDetails']['relatedPlaylists']['uploads']
        
        playlist_req = youtube.playlistItems().list(
            part="contentDetails",
            playlistId=uploads_id,
            maxResults=max_results
        )
        playlist_resp = playlist_req.execute()
        video_ids = [item['contentDetails']['videoId'] for item in playlist_resp.get('items', [])]
        
        if not video_ids:
            return []
            
        return YouTubeService.get_videos_batch(video_ids)
