import React, { useState } from 'react';
import { MetricCard } from '../components/common/MetricCard';
import { TrendChart } from '../components/charts/TrendChart';
import { Eye, ThumbsUp, MessageSquare, Search, Loader2 } from 'lucide-react';
import { ytAPI } from '../services/api';

export function Dashboard() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await ytAPI.getChannel(query);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch channel data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500 mt-1">Analyze any YouTube channel instantly.</p>
      </header>
      
      <form onSubmit={handleSearch} className="mb-8 flex gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Enter YouTube URL, @handle, or Channel ID..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-70 flex items-center justify-center min-w-[120px]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
        </button>
      </form>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="flex items-center gap-4 mb-6">
            {data.snippet?.thumbnails?.default?.url && (
              <img src={data.snippet.thumbnails.default.url} alt="Profile" className="w-16 h-16 rounded-full shadow-md border-2 border-white" />
            )}
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{data.snippet?.title}</h3>
              <p className="text-slate-500 font-medium">{data.snippet?.customUrl}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              title="Total Views" 
              value={Number(data.statistics?.viewCount).toLocaleString() || '0'} 
              icon={Eye} 
              trend="up" 
            />
            <MetricCard 
              title="Subscribers" 
              value={Number(data.statistics?.subscriberCount).toLocaleString() || '0'} 
              icon={ThumbsUp} 
              trend="up" 
            />
            <MetricCard 
              title="Total Videos" 
              value={Number(data.statistics?.videoCount).toLocaleString() || '0'} 
              icon={MessageSquare} 
              trend="up" 
            />
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50 shadow-sm">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Next Steps
            </h3>
            <p className="text-blue-800/80">
              Channel overview loaded successfully. To view deeper insights, timing analysis, and AI-powered recommendations, head over to the Analysis or AI Insights tab!
            </p>
          </div>
        </>
      )}
      
      {!data && !loading && !error && (
        <div className="py-24 text-center flex flex-col items-center justify-center text-slate-400">
          <div className="p-4 bg-slate-100 rounded-full mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-lg font-medium text-slate-600">No channel selected</p>
          <p className="mt-1">Search for a channel using its handle or URL to begin.</p>
        </div>
      )}
    </div>
  );
}
