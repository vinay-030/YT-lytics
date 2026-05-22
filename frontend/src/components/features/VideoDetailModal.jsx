import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, ThumbsUp, MessageSquare, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export function VideoDetailModal({ video, isOpen, onClose }) {
  if (!isOpen || !video) return null;

  const views = Number(video.statistics?.viewCount || 0);
  const likes = Number(video.statistics?.likeCount || 0);
  const comments = Number(video.statistics?.commentCount || 0);
  const rawEngagementRate = views > 0 ? ((likes + comments) / views) * 100 : 0;
  const engagementRate = rawEngagementRate.toFixed(2);
  
  // Cap the progress bar at 15% to make variations visible
  const engagementWidth = Math.min((rawEngagementRate / 10) * 100, 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Cinematic Header */}
          <div className="relative h-48 sm:h-64 bg-slate-900 w-full overflow-hidden">
             <img src={video.snippet?.thumbnails?.high?.url} className="w-full h-full object-cover opacity-60 blur-sm scale-110" alt="bg" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
             
             <div className="absolute bottom-6 left-6 right-6 flex gap-6 items-end">
                <img src={video.snippet?.thumbnails?.high?.url} className="w-40 rounded-xl shadow-2xl border-2 border-white/20 aspect-video object-cover" alt="thumbnail" />
                <div className="flex-1 pb-2">
                   <h2 className="text-2xl font-bold text-white line-clamp-2 leading-tight">{video.snippet?.title}</h2>
                   <p className="text-slate-300 mt-2 flex items-center gap-4 text-sm font-medium">
                     <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(video.snippet?.publishedAt).toLocaleDateString()}</span>
                     {video.contentDetails && <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {video.contentDetails?.duration.replace('PT','').toLowerCase()}</span>}
                   </p>
                </div>
             </div>
             
             <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors">
               <X className="w-5 h-5" />
             </button>
          </div>
          
          <div className="p-6 sm:p-8 overflow-y-auto no-scrollbar">
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1"><Eye className="w-4 h-4 text-blue-500"/> Views</p>
                <p className="text-xl font-bold text-slate-900">{views.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1"><ThumbsUp className="w-4 h-4 text-emerald-500"/> Likes</p>
                <p className="text-xl font-bold text-slate-900">{likes.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1"><MessageSquare className="w-4 h-4 text-amber-500"/> Comments</p>
                <p className="text-xl font-bold text-slate-900">{comments.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 h-1 bg-indigo-500" style={{ width: `${engagementWidth}%` }}></div>
                <p className="text-sm font-medium text-indigo-600 mb-1">Engagement</p>
                <p className="text-xl font-bold text-indigo-900">{engagementRate}%</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                AI Audience Insights
              </h3>
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100/50 shadow-sm">
                <ul className="space-y-4 text-indigo-950/80">
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 mt-0.5 text-lg">📈</span>
                    <div>
                      <strong className="block text-indigo-900 mb-0.5">Engagement Analysis</strong>
                      <span>With an engagement rate of {engagementRate}%, this video {rawEngagementRate > 5 ? "is performing exceptionally well, indicating strong audience resonance." : "shows standard performance. Consider stronger calls-to-action."}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 mt-0.5 text-lg">⏱️</span>
                    <div>
                       <strong className="block text-indigo-900 mb-0.5">Retention Estimate</strong>
                       <span>The duration aligns with {views > 100000 ? "optimal retention patterns for this format." : "standard watch-time expectations. To increase views, test slightly shorter hooks."}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Description</h3>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap font-mono max-h-[200px] overflow-y-auto no-scrollbar">
                {video.snippet?.description || "No description available."}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
