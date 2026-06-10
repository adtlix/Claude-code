'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { CanvasNode } from '@/types';

const TYPE_COLORS: Record<string, string> = {
  weather: 'border-l-blue-500',
  report: 'border-l-purple-500',
  news: 'border-l-cyan-400',
  data: 'border-l-green-500',
};

const TYPE_LABELS: Record<string, string> = {
  weather: 'Weather',
  report: 'Report',
  news: 'News',
  data: 'Data',
};

const TYPE_DOT_COLORS: Record<string, string> = {
  weather: 'bg-blue-500',
  report: 'bg-purple-500',
  news: 'bg-cyan-400',
  data: 'bg-green-500',
};

interface NodeCardProps {
  node: CanvasNode;
  children: React.ReactNode;
}

export default function NodeCard({ node, children }: NodeCardProps) {
  return (
    <motion.div
      key={node.id}
      className={clsx(
        'absolute w-[280px] rounded-2xl border-l-2 cursor-default',
        'bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08]',
        'shadow-node hover:shadow-node-hover transition-shadow duration-300',
        TYPE_COLORS[node.type] ?? 'border-l-white/20'
      )}
      style={{
        left: node.x,
        top: node.y,
        transform: 'translate(-50%, -50%)',
        willChange: 'transform',
      }}
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -8 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Type badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08]">
        <span className={clsx('w-1.5 h-1.5 rounded-full', TYPE_DOT_COLORS[node.type])} />
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
          {TYPE_LABELS[node.type]}
        </span>
      </div>

      <div className="p-4 pt-5">
        <h3 className="text-sm font-medium text-white/80 mb-3 pr-16 leading-tight">
          {node.title}
        </h3>
        {children}
      </div>
    </motion.div>
  );
}
