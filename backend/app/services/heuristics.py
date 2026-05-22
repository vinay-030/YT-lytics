class AnalyticsHeuristics:
    """
    Modular heuristics engine for estimating private YouTube metrics based on public data.
    Can be replaced or extended with ML models in the future.
    """
    
    @staticmethod
    def estimate_shares(view_count, like_count, comment_count):
        """
        Estimates the number of shares a video received.
        Formula: Shares are typically 0.5% of views, but highly correlated with likes and comments.
        """
        try:
            views = int(view_count or 0)
            likes = int(like_count or 0)
            comments = int(comment_count or 0)
            
            if views == 0:
                return 0
                
            # Base share rate is ~0.2% of views
            base_shares = views * 0.002
            # Engagement driven shares: Every like ~ 0.05 shares, every comment ~ 0.2 shares
            engagement_shares = (likes * 0.05) + (comments * 0.2)
            
            estimated = int(base_shares + engagement_shares)
            return estimated
        except Exception:
            return 0

    @staticmethod
    def estimate_subscriber_gain(view_count, like_count, comment_count):
        """
        Estimates the number of subscribers gained from a video.
        Formula: Sub gain is typically 0.1% to 1% of views, heavily weighted by likes.
        """
        try:
            views = int(view_count or 0)
            likes = int(like_count or 0)
            
            if views == 0:
                return 0
                
            # Base sub rate is ~0.1% of views
            base_subs = views * 0.001
            # Highly liked videos convert better: every like ~ 0.02 subs
            engagement_subs = likes * 0.02
            
            estimated = int(base_subs + engagement_subs)
            return estimated
        except Exception:
            return 0
