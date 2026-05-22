import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

export function Skeleton({ className, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
      className={cn("bg-slate-200/60 rounded-xl", className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
