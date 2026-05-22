import React from 'react';
import { motion } from 'framer-motion';

export function TopNav() {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center"
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-500">YT-lytics <span className="mx-2">/</span> <span className="text-slate-900 font-semibold">Workspace</span></p>
      </div>
      
      <div className="flex items-center gap-6">
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Beta v2.0</p>
      </div>
    </motion.div>
  );
}
