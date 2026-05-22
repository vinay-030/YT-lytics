import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Sparkles, Send, Lightbulb } from 'lucide-react';
import { ytAPI } from '../services/api';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

const TypingText = ({ text }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    if (!text) {
      setDisplayed('');
      return;
    }
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);
  
  return <div className="prose prose-sm prose-purple max-w-none text-slate-700"><Markdown>{displayed || ""}</Markdown></div>;
};

export function AIInsights() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState('');
  
  const [messages, setMessages] = useState([{ role: 'model', content: "Hi! I'm YT-lytics AI. Ask me anything about YouTube strategy or analyze a channel!" }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    setError('');
    
    try {
      const channelRes = await ytAPI.getChannel(query);
      const channel = channelRes.data;
      
      const context = `Channel: ${channel.snippet?.title}\nSubscribers: ${channel.statistics?.subscriberCount}\nTotal Views: ${channel.statistics?.viewCount}\nTotal Videos: ${channel.statistics?.videoCount}\nDescription: ${channel.snippet?.description}`;
        
      const response = await ytAPI.getRecommendations(context);
      setRecommendations(response.data.recommendations);
      
      setMessages(prev => [
        ...prev, 
        { role: 'model', content: `I've just analyzed ${channel.snippet?.title}. Feel free to ask me detailed questions about their potential strategy!` }
      ]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };
  
  const submitChat = async (text) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setChatInput('');
    setChatLoading(true);
    
    try {
      const res = await ytAPI.chat(newMessages);
      setMessages([...newMessages, { role: 'model', content: res.data.response }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'model', content: "Sorry, I encountered an error. Please check your API keys." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChat = (e) => {
    e.preventDefault();
    submitChat(chatInput);
  };

  const suggestedPrompts = [
    "How can I improve CTR?",
    "What is the best upload frequency?",
    "Analyze the engagement rate."
  ];

  return (
    <ErrorBoundary>
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" /> AI Insights Engine
        </h2>
        <p className="text-slate-500 mt-1">Powered by Gemini 1.5 Pro & Flash.</p>
      </header>

      <form onSubmit={handleAnalyze} className="mb-8 flex gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Enter a channel to generate a strategy report..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-2xl shadow-lg shadow-purple-600/20 transition-all disabled:opacity-70 flex items-center min-w-[150px]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Generate Report'}
        </button>
      </form>
      
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 flex flex-col h-[calc(100vh-300px)] min-h-[500px]">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
             <Lightbulb className="w-5 h-5 text-purple-500" /> Chat Assistant
          </h3>
          <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2 no-scrollbar">
            {messages.map((m, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-purple-600 text-white rounded-br-sm' : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm'}`}>
                  {m.role === 'user' ? (
                    <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                  ) : (
                    i === messages.length - 1 && !chatLoading ? (
                      <TypingText text={m.content || "..."} />
                    ) : (
                      <div className="prose prose-sm prose-purple max-w-none text-slate-700"><Markdown>{m.content || "..."}</Markdown></div>
                    )
                  )}
                </div>
              </motion.div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 text-slate-800 p-4 rounded-2xl rounded-bl-sm flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <div className="mb-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {suggestedPrompts.map(p => (
              <button 
                key={p} 
                onClick={() => submitChat(p)}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium rounded-full whitespace-nowrap transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          <form onSubmit={handleChat} className="flex gap-2 relative">
            <input 
              type="text" 
              placeholder="Ask anything..."
              className="flex-1 pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-white shadow-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" disabled={chatLoading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-70 transition-colors shadow-sm">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="glass-panel p-6 overflow-y-auto h-[calc(100vh-300px)] min-h-[500px] no-scrollbar">
          <h3 className="text-xl font-bold text-slate-900 mb-6 sticky top-0 bg-white/80 backdrop-blur-md py-2 z-10 border-b border-slate-100">Strategic Recommendations</h3>
          {loading ? (
             <div className="space-y-4 pt-4">
               <div className="h-6 bg-slate-200 rounded w-1/3 animate-pulse"></div>
               <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
               <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
               <div className="h-32 bg-slate-50 rounded-xl w-full animate-pulse mt-6"></div>
             </div>
          ) : recommendations ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
              <div className="prose prose-purple max-w-none text-slate-700">
                <Markdown>
                  {recommendations || "No recommendations generated."}
                </Markdown>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Sparkles className="w-12 h-12 mb-4 text-slate-300" />
              <p>Run a channel analysis to generate the report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
