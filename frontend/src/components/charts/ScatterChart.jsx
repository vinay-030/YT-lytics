import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

export function ScatterChart({ data, title, xLabel, yLabel }) {
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
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (ctx) => `${xLabel}: ${ctx.raw.x}, ${yLabel}: ${ctx.raw.y}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: !!yLabel, text: yLabel, color: '#64748b' },
        grid: { color: 'rgba(226, 232, 240, 0.4)', drawBorder: false },
      },
      x: {
        title: { display: !!xLabel, text: xLabel, color: '#64748b' },
        grid: { display: false },
      },
    },
  };

  const chartData = {
    datasets: [
      {
        label: title,
        data: data,
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
        borderColor: 'rgb(37, 99, 235)',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  return (
    <div className="relative group w-full h-full min-h-[350px]">
      <div className="absolute -top-12 right-0 z-10">
        <button onClick={handleExport} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2 text-sm font-medium">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>
      <div ref={chartRef} className="w-full h-full bg-white rounded-xl p-4">
        <Scatter options={options} data={chartData} />
      </div>
    </div>
  );
}
