import React, { useState } from 'react';
import { GroupedBarChart } from '../components/charts/GroupedBarChart';
import { VideoDetailModal } from '../components/features/VideoDetailModal';
import { Loader2, Plus, X, GripVertical, Trophy, TrendingUp, Users } from 'lucide-react';
import { ytAPI } from '../services/api';
import { motion } from 'framer-motion';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function extractId(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

function SortableInput({ id, url, idx, onChange, onRemove, canRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };
  
  const videoId = extractId(url);

  return (
    <div ref={setNodeRef} style={style} className={`flex gap-4 items-center bg-white p-2 rounded-2xl border ${isDragging ? 'border-blue-500 shadow-lg scale-105' : 'border-slate-200 shadow-sm'} relative group`}>
      <div {...attributes} {...listeners} className="p-3 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
        <GripVertical className="w-5 h-5" />
      </div>
      <input 
        type="text" 
        placeholder="Enter YouTube Video URL..."
        className="flex-1 px-2 py-3 bg-transparent outline-none text-slate-700"
        value={url}
        onChange={(e) => onChange(idx, e.target.value)}
      />
      {videoId && (
         <img src={`https://img.youtube.com/vi/${videoId}/default.jpg`} className="w-16 h-10 object-cover rounded-lg shadow-sm border border-slate-100 hidden sm:block" alt="preview" onError={(e) => e.target.style.display='none'} />
      )}
      {canRemove && (
        <button type="button" onClick={() => onRemove(id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export function Compare() {
  const [items, setItems] = useState([{ id: '1', url: '' }, { id: '2', url: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddUrl = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), url: '' }]);
  };

  const handleRemoveUrl = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleChangeUrl = (idx, val) => {
    const newItems = [...items];
    newItems[idx].url = val;
    setItems(newItems);
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    const validUrls = items.map(i => i.url).filter(u => u.trim() !== '');
    if (validUrls.length < 2) {
      setError("Please enter at least 2 valid video URLs to compare.");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const videoIds = validUrls.map(extractId).filter(Boolean);
      const response = await ytAPI.getVideosBatch(videoIds);
      if (response.data && response.data.length > 0) {
        setData(response.data);
      } else {
        setError("Could not fetch data for the provided URLs.");
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch comparison data');
    } finally {
      setLoading(false);
    }
  };

  const chartDataViews = data ? {
    labels: data.map(v => v.snippet.title.substring(0, 15) + '...'),
    datasets: [{
      label: 'Views',
      data: data.map(v => Number(v.statistics.viewCount || 0)),
      backgroundColor: 'rgba(37, 99, 235, 0.8)',
    }]
  } : null;

  const chartDataEng = data ? {
    labels: data.map(v => v.snippet.title.substring(0, 15) + '...'),
    datasets: [
      {
        label: 'Likes',
        data: data.map(v => Number(v.statistics.likeCount || 0)),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'Comments',
        data: data.map(v => Number(v.statistics.commentCount || 0)),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
      }
    ]
  } : null;

  const getWinnerBadge = (video) => {
    if (!data) return null;
    const maxViews = Math.max(...data.map(v => Number(v.statistics.viewCount || 0)));
    if (Number(video.statistics.viewCount || 0) === maxViews) {
      return (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border-2 border-white z-10">
          <Trophy className="w-3 h-3" /> Winner
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <header className="mb-4">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Video Comparison</h2>
        <p className="text-slate-500 mt-1">Compare performance side-by-side. Drag to reorder.</p>
      </header>

      <div className="glass-panel p-6 sm:p-8">
        <form onSubmit={handleCompare} className="space-y-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {items.map((item, idx) => (
                <SortableInput 
                  key={item.id} 
                  id={item.id}
                  idx={idx}
                  url={item.url}
                  onChange={handleChangeUrl}
                  onRemove={handleRemoveUrl}
                  canRemove={items.length > 2}
                />
              ))}
            </SortableContext>
          </DndContext>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 mt-6">
            {items.length < 5 && (
              <button 
                type="button" 
                onClick={handleAddUrl}
                className="px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-2xl transition-colors border border-slate-200 flex justify-center items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Another Video
              </button>
            )}
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2 sm:ml-auto"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Run Comparison'}
            </button>
          </div>
        </form>
        
        {error && <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">{error}</div>}
      </div>

      {data && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">View Comparison</h3>
              <GroupedBarChart data={chartDataViews} title="View Comparison" />
            </div>
            <div className="glass-panel p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Engagement Comparison</h3>
              <GroupedBarChart data={chartDataEng} title="Engagement Comparison" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((v, i) => {
              const views = Number(v.statistics.viewCount || 0);
              const likes = Number(v.statistics.likeCount || 0);
              const comments = Number(v.statistics.commentCount || 0);
              const engRate = views ? (((likes + comments) / views) * 100).toFixed(1) : 0;

              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedVideo(v)}
                  className="relative p-6 border border-slate-100 rounded-3xl bg-white shadow-sm hover:shadow-xl cursor-pointer hover:border-blue-300 transition-all duration-300 group flex flex-col"
                >
                  {getWinnerBadge(v)}
                  <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 bg-slate-100">
                    <img src={v.snippet.thumbnails.medium?.url || v.snippet.thumbnails.default?.url} alt="thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
                      {v.contentDetails?.duration.replace('PT','').toLowerCase()}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 line-clamp-2 text-base leading-snug mb-4 flex-1">{v.snippet.title}</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Eng. Rate</p>
                      <p className="font-bold text-slate-800 text-lg">{engRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> Est. Subs</p>
                      <p className="font-bold text-blue-600 text-lg">+{v.statistics.estimatedSubscriberGain || 0}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      <VideoDetailModal 
        isOpen={!!selectedVideo} 
        video={selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
      />
    </div>
  );
}
