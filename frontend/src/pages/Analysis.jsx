import React, { useState } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { ytAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';

const commonOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 16 / 9,
  plugins: {
    legend: { position: 'top', labels: { font: { family: 'Inter', size: 13 } } },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#0f172a',
      bodyColor: '#334155',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 12,
      bodyFont: { family: 'Inter', size: 13 },
      titleFont: { family: 'Inter', size: 14, weight: 'bold' }
    }
  },
  scales: {
    y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Inter' } } },
    x: { grid: { display: false }, ticks: { font: { family: 'Inter' } } }
  }
};

export function Analysis() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videos, setVideos] = useState(null);
  const [timingData, setTimingData] = useState(null);
  const [durationData, setDurationData] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    setError('');
    
    try {
      const videosResponse = await ytAPI.getRecentVideos(query);
      const vids = videosResponse.data;
      
      if (!vids || vids.length === 0) {
        throw new Error("No recent videos found for this channel.");
      }

      setVideos(vids.sort((a,b) => new Date(a.snippet.publishedAt) - new Date(b.snippet.publishedAt)));
      
      const timingResponse = await ytAPI.analyzeTiming(vids);
      const durationResponse = await ytAPI.analyzeDuration(vids);
      
      setTimingData(timingResponse.data);
      setDurationData(durationResponse.data);
      
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to perform analysis');
    } finally {
      setLoading(false);
    }
  };

  const getTimingChartData = () => {
    if (!timingData) return null;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const avgViewsByDay = days.map(d => {
      let total = 0, count = 0;
      Object.entries(timingData).forEach(([key, stats]) => {
        if (key.startsWith(d)) {
          total += stats.total_views;
          count += stats.count;
        }
      });
      return count > 0 ? Math.round(total / count) : 0;
    });

    return {
      labels: days,
      datasets: [{
        label: 'Avg Views by Upload Day',
        data: avgViewsByDay,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderRadius: 4
      }]
    };
  };

  const getDurationChartData = () => {
    if (!durationData) return null;
    const labels = Object.keys(durationData);
    const data = labels.map(l => durationData[l].count > 0 ? Math.round(durationData[l].total_views / durationData[l].count) : 0);

    return {
      labels,
      datasets: [{
        label: 'Avg Views by Duration',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4
      }]
    };
  };

  const getWeeklyPerformanceData = () => {
    if (!videos) return null;
    return {
      labels: videos.map(v => new Date(v.snippet.publishedAt).toLocaleDateString()),
      datasets: [{
        label: 'Views Trend',
        data: videos.map(v => Number(v.statistics.viewCount || 0)),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    };
  };

  const getEngagementTrendData = () => {
    if (!videos) return null;
    return {
      labels: videos.map(v => new Date(v.snippet.publishedAt).toLocaleDateString()),
      datasets: [{
        label: 'Engagement Rate (%)',
        data: videos.map(v => {
          const views = Number(v.statistics.viewCount || 0);
          if (!views) return 0;
          return (((Number(v.statistics.likeCount || 0) + Number(v.statistics.commentCount || 0)) / views) * 100).toFixed(2);
        }),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    };
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Advanced Analysis</h2>
        <p className="text-slate-500 mt-1">Discover optimal upload timings and duration patterns.</p>
      </header>

      <div className="glass-panel p-6">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Enter YouTube URL or @handle to analyze recent videos..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-2xl shadow-lg transition-all disabled:opacity-70 flex items-center justify-center min-w-[150px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Run Analysis'}
          </button>
        </form>
        {error && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl font-medium">{error}</div>}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-200 animate-pulse rounded-3xl w-full"></div>
          <div className="h-64 bg-slate-200 animate-pulse rounded-3xl w-full"></div>
        </div>
      )}

      {videos && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Upload Timing Performance</h3>
              <div className="w-full">
                <Bar data={getTimingChartData()} options={commonOptions} />
              </div>
            </div>
            
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Duration Performance</h3>
              <div className="w-full">
                <Bar data={getDurationChartData()} options={commonOptions} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Audience Engagement Trends</h3>
              <div className="w-full">
                <Line data={getEngagementTrendData()} options={commonOptions} />
              </div>
            </div>

            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Weekly Performance History</h3>
              <div className="w-full">
                <Line data={getWeeklyPerformanceData()} options={commonOptions} />
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </div>
  );
}
