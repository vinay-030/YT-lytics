import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { Dashboard } from './pages/Dashboard';

const Compare = () => <div className="p-4"><h2 className="text-2xl font-bold">Compare Videos</h2></div>;
const Analysis = () => <div className="p-4"><h2 className="text-2xl font-bold">Analysis</h2></div>;
const AIInsights = () => <div className="p-4"><h2 className="text-2xl font-bold">AI Insights</h2></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="compare" element={<Compare />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="ai-insights" element={<AIInsights />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
