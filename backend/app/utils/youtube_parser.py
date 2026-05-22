import re
from urllib.parse import urlparse, parse_qs

def parse_youtube_identifier(input_string):
    """
    Parses a YouTube URL or handle/ID and returns the type and value.
    Returns: dict {'type': 'video'|'channel'|'handle', 'value': string}
    """
    input_string = input_string.strip()
    
    # Handle pure IDs or @handles
    if input_string.startswith('@'):
        return {'type': 'handle', 'value': input_string}
    
    if len(input_string) == 11 and not '/' in input_string and not ' ' in input_string:
        return {'type': 'video', 'value': input_string}
        
    try:
        # URL parsing
        parsed_url = urlparse(input_string)
        if not parsed_url.scheme:
            # If no scheme, assume https and try again
            parsed_url = urlparse('https://' + input_string)
            
        domain = parsed_url.netloc.lower()
        path = parsed_url.path
        
        # youtu.be/VIDEO_ID
        if 'youtu.be' in domain:
            video_id = path.lstrip('/')
            return {'type': 'video', 'value': video_id}
            
        if 'youtube.com' in domain:
            # watch?v=VIDEO_ID
            if path == '/watch':
                qs = parse_qs(parsed_url.query)
                if 'v' in qs:
                    return {'type': 'video', 'value': qs['v'][0]}
            
            # /shorts/VIDEO_ID
            elif path.startswith('/shorts/'):
                video_id = path.split('/')[2]
                return {'type': 'video', 'value': video_id}
                
            # /embed/VIDEO_ID
            elif path.startswith('/embed/'):
                video_id = path.split('/')[2]
                return {'type': 'video', 'value': video_id}
                
            # /@handle
            elif path.startswith('/@'):
                handle = path.split('/')[1]
                return {'type': 'handle', 'value': handle}
                
            # /c/customname
            elif path.startswith('/c/'):
                parts = path.split('/')
                if len(parts) > 2:
                    return {'type': 'custom', 'value': parts[2]}
                    
            # /channel/id
            elif path.startswith('/channel/'):
                parts = path.split('/')
                if len(parts) > 2:
                    return {'type': 'channel', 'value': parts[2]}
                
    except Exception as e:
        return {'type': 'unknown', 'value': input_string}
        
    return {'type': 'unknown', 'value': input_string}
