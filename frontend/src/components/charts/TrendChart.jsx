import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export function TrendChart({ data, title }) {
  const chartRef = useRef(null);
  
  const handleExport = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, { backgroundColor: '#ffffff' });
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = `${title.replace(/\\s+/g, '_').toLowerCase()}.png`;
    link.click();
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { usePointStyle: true, boxWidth: 8, padding: 20, color: '#475569' }
      },
      title: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(226, 232, 240, 0.4)', drawBorder: false },
        ticks: { color: '#64748b' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' }
      }
    },
    elements: {
      line: { tension: 0.4, borderWidth: 3 },
      point: { radius: 0, hoverRadius: 6 }
    }
  };

  return (
    <div className="relative group w-full h-full min-h-[350px]">
      <div className="absolute -top-12 right-0 z-10">
        <button onClick={handleExport} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2 text-sm font-medium">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>
      <div ref={chartRef} className="w-full h-full bg-white rounded-xl p-4">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
