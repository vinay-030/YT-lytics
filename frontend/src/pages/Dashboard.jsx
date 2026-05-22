import React, { useState } from 'react';
import { Search, Loader2, Calendar, LayoutList } from 'lucide-react';
import { ytAPI } from '../services/api';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function parseDuration(duration) {
  if (!duration) return 0;
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const h = (parseInt(match[1]) || 0) * 3600;
  const m = (parseInt(match[2]) || 0) * 60;
  const s = (parseInt(match[3]) || 0);
  return h + m + s;
}

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
      titleFont: { family: 'Inter', size: 14, weight: 'bold' },
      callbacks: {
        title: (context) => context[0].label.split('||')[1] || context[0].label,
        label: (context) => ` ${context.dataset.label}: ${context.parsed.y.toLocaleString()}`
      }
    }
  },
  scales: {
    y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Inter' } } },
    x: { grid: { display: false }, ticks: { font: { family: 'Inter' }, callback: function(val, index) { return this.getLabelForValue(val).split('||')[0]; } } }
  }
};

export function Dashboard() {
  const [query, setQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videos, setVideos] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query || !dateFrom || !dateTo) {
      setError("Please fill out the URL/handle and both dates.");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await ytAPI.getVideosByDateRange(query, dateFrom, dateTo);
      // Sort by date ascending for charts
      const sorted = (response.data || []).sort((a, b) => new Date(a.snippet.publishedAt) - new Date(b.snippet.publishedAt));
      setVideos(sorted);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const shortVideos = videos.filter(v => parseDuration(v.contentDetails?.duration) < 180);
  const medVideos = videos.filter(v => parseDuration(v.contentDetails?.duration) >= 180 && parseDuration(v.contentDetails?.duration) <= 600);
  const longVideos = videos.filter(v => parseDuration(v.contentDetails?.duration) > 600);

  // Chart Data Preparation
  const labels = videos.map(v => `${new Date(v.snippet.publishedAt).toLocaleDateString()}||${v.snippet.title.substring(0, 40)}...`);
  
  const viewsData = {
    labels,
    datasets: [{
      label: 'Views',
      data: videos.map(v => Number(v.statistics.viewCount || 0)),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const likesData = {
    labels,
    datasets: [{
      label: 'Likes',
      data: videos.map(v => Number(v.statistics.likeCount || 0)),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const commentsData = {
    labels,
    datasets: [{
      label: 'Comments',
      data: videos.map(v => Number(v.statistics.commentCount || 0)),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const sharesData = {
    labels,
    datasets: [{
      label: 'Estimated Shares',
      data: videos.map(v => Number(v.statistics.estimatedShares || 0)),
      backgroundColor: '#8b5cf6',
      borderRadius: 4
    }]
  };

  const subsData = {
    labels,
    datasets: [{
      label: 'Estimated Subscriber Gain',
      data: videos.map(v => Number(v.statistics.estimatedSubscriberGain || 0)),
      borderColor: '#ec4899',
      backgroundColor: 'rgba(236, 72, 153, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="space-y-8">
      <header className="mb-4">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h2>
        <p className="text-slate-500 mt-1">Advanced date-filtered performance metrics.</p>
      </header>

      <div className="glass-panel p-6">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="YouTube URL or @handle..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4 flex-1">
            <div className="relative w-1/2">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="date" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-600"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="relative w-1/2">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="date" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-600"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-70 flex items-center justify-center min-w-[140px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Run Analysis'}
          </button>
        </form>
        {error && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl font-medium">{error}</div>}
      </div>

      {loading && (
        <div className="space-y-6">
          <div className="h-64 bg-slate-200 animate-pulse rounded-3xl w-full"></div>
          <div className="h-64 bg-slate-200 animate-pulse rounded-3xl w-full"></div>
        </div>
      )}

      {videos.length > 0 && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pt-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 border-l-4 border-l-blue-500">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Shorts & Quick (&lt; 3m)</h4>
              <p className="text-3xl font-bold text-slate-900">{shortVideos.length} <span className="text-base font-normal text-slate-500">videos</span></p>
            </div>
            <div className="glass-panel p-6 border-l-4 border-l-emerald-500">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Standard (3m - 10m)</h4>
              <p className="text-3xl font-bold text-slate-900">{medVideos.length} <span className="text-base font-normal text-slate-500">videos</span></p>
            </div>
            <div className="glass-panel p-6 border-l-4 border-l-purple-500">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Long Form (&gt; 10m)</h4>
              <p className="text-3xl font-bold text-slate-900">{longVideos.length} <span className="text-base font-normal text-slate-500">videos</span></p>
            </div>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Views Trajectory</h3>
            <div className="w-full relative">
              <Line data={viewsData} options={commonOptions} />
            </div>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Engagement: Likes Trend</h3>
            <div className="w-full relative">
              <Line data={likesData} options={commonOptions} />
            </div>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Engagement: Comments Activity</h3>
            <div className="w-full relative">
              <Line data={commentsData} options={commonOptions} />
            </div>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Estimated Share Velocity</h3>
            <div className="w-full relative">
              <Bar data={sharesData} options={commonOptions} />
            </div>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Estimated Subscriber Acquisition</h3>
            <div className="w-full relative">
              <Line data={subsData} options={commonOptions} />
            </div>
          </div>

          <div className="glass-panel p-8 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <LayoutList className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-900">Recent Videos Data</h3>
            </div>
            <div className="overflow-x-auto w-full no-scrollbar pb-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Video</th>
                    <th className="py-4 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="py-4 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Views</th>
                    <th className="py-4 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Engagement</th>
                    <th className="py-4 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Est. Growth</th>
                    <th className="py-4 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {videos.slice().reverse().map((v, i) => {
                    const views = Number(v.statistics.viewCount || 0);
                    const likes = Number(v.statistics.likeCount || 0);
                    const engRate = views ? ((likes + Number(v.statistics.commentCount || 0)) / views * 100).toFixed(1) : 0;
                    
                    return (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-4">
                            <img src={v.snippet.thumbnails.default?.url} className="w-16 h-10 object-cover rounded shadow-sm border border-slate-200" alt="thumb" />
                            <div className="max-w-[200px]">
                              <p className="font-semibold text-slate-900 truncate">{v.snippet.title}</p>
                              <p className="text-xs text-slate-500 mt-1">{v.contentDetails?.duration.replace('PT','').toLowerCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-medium whitespace-nowrap">
                          {new Date(v.snippet.publishedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-slate-900 font-bold whitespace-nowrap">
                          {views.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-emerald-600 font-semibold">{likes.toLocaleString()} likes</span>
                            <span className="text-xs text-slate-500 mt-1">{engRate}% rate</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-blue-600 font-semibold">+{v.statistics.estimatedSubscriberGain} subs</span>
                            <span className="text-xs text-slate-500 mt-1">{v.statistics.estimatedShares} shares</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${engRate > 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                            {engRate > 5 ? 'Excellent' : 'Average'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {videos.length === 0 && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Calendar className="w-16 h-16 mb-4 text-slate-300" />
          <p className="text-lg">Select a date range to load video performance data.</p>
        </div>
      )}
    </div>
  );
}
