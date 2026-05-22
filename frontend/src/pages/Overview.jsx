import React, { useState } from 'react';
import { MetricCard } from '../components/common/MetricCard';
import { CardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Eye, ThumbsUp, MessageSquare, Search, Loader2, ArrowRight } from 'lucide-react';
import { ytAPI } from '../services/api';
import { motion } from 'framer-motion';

export function Overview() {
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
    <div className="space-y-8">
      <header className="mb-4">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Channel Overview</h2>
        <p className="text-slate-500 mt-1">Search and analyze any YouTube creator instantly.</p>
      </header>
      
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-3xl">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Enter YouTube URL, @handle, or Channel ID..."
            className="w-full pl-14 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-70 flex items-center justify-center min-w-[140px]"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Analyze'}
        </button>
      </form>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {data && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pt-4">
          
          {/* Hero Banner Section */}
          <div className="relative rounded-3xl overflow-hidden glass-card">
            <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-full relative">
              {data.brandingSettings?.image?.bannerExternalUrl && (
                <img src={data.brandingSettings.image.bannerExternalUrl} alt="banner" className="w-full h-full object-cover opacity-40 mix-blend-overlay absolute inset-0" />
              )}
            </div>
            <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
              <img 
                src={data.snippet?.thumbnails?.high?.url || data.snippet?.thumbnails?.default?.url} 
                alt="Profile" 
                className="w-32 h-32 rounded-full shadow-2xl border-4 border-white bg-white z-10" 
              />
              <div className="text-center sm:text-left flex-1 mb-2">
                <h3 className="text-3xl font-extrabold text-slate-900">{data.snippet?.title}</h3>
                <p className="text-slate-500 font-medium mt-1">{data.snippet?.customUrl}</p>
              </div>
              <div className="mb-2">
                 <a href={`https://youtube.com/${data.snippet?.customUrl || 'channel/' + data.id}`} target="_blank" rel="noreferrer" className="px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg inline-block">
                   View Channel
                 </a>
              </div>
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
          
          <div className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-100 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-purple-500/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-purple-950 mb-2">AI Quick Summary</h3>
              <p className="text-purple-800/80 mb-6 max-w-2xl">
                This channel has established a solid foundation with {Number(data.statistics?.subscriberCount).toLocaleString()} subscribers. To unlock deeper performance metrics, duration strategies, and Gemini AI insights, explore the advanced modules on the sidebar.
              </p>
              <div className="flex gap-4">
                <a href="/dashboard" className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-md">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/ai-insights" className="px-6 py-2.5 bg-white text-purple-600 border border-purple-200 rounded-xl font-medium hover:bg-purple-50 transition-colors">
                  Ask AI Assistant
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {!data && !loading && !error && (
        <EmptyState 
          title="No Channel Selected" 
          description="Enter a YouTube handle or URL in the search bar above to fetch real-time analytics and begin exploring AI insights."
        />
      )}
    </div>
  );
}
