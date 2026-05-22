import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

export function MetricCard({ title, value, change, icon: Icon, trend }) {
  const isPositive = trend === 'up';
  
  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
      className="glass-panel p-6 flex flex-col gap-4 transition-shadow"
    >
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="p-2 bg-blue-50/50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      
      <div>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        {change && (
          <p className={cn(
            "text-sm font-medium mt-1",
            isPositive ? "text-emerald-600" : "text-rose-600"
          )}>
            {isPositive ? '+' : '-'}{change}
          </p>
        )}
      </div>
    </motion.div>
  );
}
