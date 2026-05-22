import React from 'react';
import { FolderSearch } from 'lucide-react';
import { motion } from 'framer-motion';

export function EmptyState({ icon: Icon = FolderSearch, title, description, action }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-sm"
    >
      <div className="p-4 bg-slate-50 rounded-full mb-4">
        <Icon className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
