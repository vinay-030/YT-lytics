import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

export const ytAPI = {
  getChannel: (identifier) => API.get(`/channel/${encodeURIComponent(identifier)}`),
  getVideosBatch: (videoIds) => API.post('/videos/batch', { video_ids: videoIds }),
  analyzeTiming: (videos) => API.post('/analysis/timing', { videos }),
  analyzeDuration: (videos) => API.post('/analysis/duration', { videos }),
  getRecommendations: (context) => API.post('/ai/recommendations', { context }),
  chat: (messages) => API.post('/ai/chat', { messages }),
};
