import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { Overview } from './pages/Overview';
import { Dashboard } from './pages/Dashboard';
import { Compare } from './pages/Compare';
import { Analysis } from './pages/Analysis';
import { AIInsights } from './pages/AIInsights';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="compare" element={<Compare />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="ai-insights" element={<AIInsights />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
