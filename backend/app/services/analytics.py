from datetime import datetime
import isodate

class AnalyticsService:
    @staticmethod
    def analyze_timing(videos):
        timing_stats = {}
        for video in videos:
            published_at = video['snippet']['publishedAt']
            views = int(video['statistics'].get('viewCount', 0))
            dt = datetime.strptime(published_at, "%Y-%m-%dT%H:%M:%SZ")
            
            day = dt.strftime("%A")
            hour = dt.hour
            
            key = f"{day} {hour}:00"
            if key not in timing_stats:
                timing_stats[key] = {'count': 0, 'total_views': 0}
                
            timing_stats[key]['count'] += 1
            timing_stats[key]['total_views'] += views
            
        return timing_stats
        
    @staticmethod
    def analyze_duration(videos):
        duration_stats = {'Short (0-3m)': {'count': 0, 'total_views': 0},
                          'Medium (3-10m)': {'count': 0, 'total_views': 0},
                          'Long (10m+)': {'count': 0, 'total_views': 0}}
                          
        for video in videos:
            try:
                duration_iso = video['contentDetails']['duration']
                duration_td = isodate.parse_duration(duration_iso)
                seconds = duration_td.total_seconds()
                views = int(video['statistics'].get('viewCount', 0))
                
                if seconds < 180:
                    key = 'Short (0-3m)'
                elif seconds <= 600:
                    key = 'Medium (3-10m)'
                else:
                    key = 'Long (10m+)'
                    
                duration_stats[key]['count'] += 1
                duration_stats[key]['total_views'] += views
            except Exception:
                pass
                
        return duration_stats
