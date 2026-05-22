import React, { useEffect, useRef } from 'react';
import { motion, animate } from 'framer-motion';

function AnimatedCounter({ value }) {
  const nodeRef = useRef();
  
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    
    // Extract numbers, ignore commas
    const numStr = value.replace(/,/g, '');
    const num = parseFloat(numStr);
    
    if (isNaN(num)) {
      node.textContent = value;
      return;
    }
    
    const controls = animate(0, num, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = Math.round(v).toLocaleString();
      }
    });
    
    return () => controls.stop();
  }, [value]);
  
  return <span ref={nodeRef}>{value}</span>;
}

export function MetricCard({ title, value, icon: Icon, trend }) {
  const isUp = trend === 'up';
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900">
            {typeof value === 'string' && value.includes(',') ? <AnimatedCounter value={value} /> : value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${isUp ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
