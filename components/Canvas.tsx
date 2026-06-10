'use client';

import { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimationControls, MotionValue } from 'framer-motion';

type AnimationControls = ReturnType<typeof useAnimationControls>;
import NodeCard from './NodeCard';
import WeatherNode from './nodes/WeatherNode';
import ReportNode from './nodes/ReportNode';
import NewsNode from './nodes/NewsNode';
import DataNode from './nodes/DataNode';
import type { CanvasNode } from '@/types';

// Deterministic PRNG — xmur3 + mulberry32
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s |= 0; s = s + 0x6d2b79f5 | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stars = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: 220 }, () => ({
      x: rand() * 6000,
      y: rand() * 6000,
      r: rand() * 1.4 + 0.3,
      o: rand() * 0.45 + 0.1,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 6000;
    canvas.height = 6000;
    ctx.clearRect(0, 0, 6000, 6000);

    for (const star of stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${star.o})`;
      ctx.fill();
    }
  }, [stars]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ width: 6000, height: 6000 }}
    />
  );
}

function NodeContent({ node }: { node: CanvasNode }) {
  switch (node.type) {
    case 'weather': return <WeatherNode node={node} />;
    case 'report': return <ReportNode node={node} />;
    case 'news': return <NewsNode node={node} />;
    case 'data': return <DataNode node={node} />;
  }
}

interface CanvasHUDProps {
  motionScale: MotionValue<number>;
  nodeCount: number;
  onFit: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

function CanvasHUD({ motionScale, nodeCount, onFit, onZoomIn, onZoomOut }: CanvasHUDProps) {
  const scaleDisplay = Math.round(motionScale.get() * 100);

  return (
    <div className="absolute bottom-5 left-5 flex items-center gap-2 z-50 pointer-events-none">
      <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.04] backdrop-blur border border-white/[0.08] pointer-events-auto">
        <button
          onClick={onZoomOut}
          className="w-5 h-5 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors text-lg leading-none"
          aria-label="Zoom out"
        >
          -
        </button>
        <span className="text-[11px] font-mono text-white/40 w-10 text-center tabular-nums">
          {scaleDisplay}%
        </span>
        <button
          onClick={onZoomIn}
          className="w-5 h-5 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors text-lg leading-none"
          aria-label="Zoom in"
        >
          +
        </button>
      </div>

      {nodeCount > 0 && (
        <button
          onClick={onFit}
          className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] backdrop-blur border border-white/[0.08] text-[11px] font-mono text-white/40 hover:text-white/70 transition-colors"
        >
          fit {nodeCount}
        </button>
      )}

      <span className="text-[10px] text-white/20 font-mono pl-1 hidden sm:block">
        drag to pan · scroll to zoom
      </span>
    </div>
  );
}

interface CanvasProps {
  nodes: CanvasNode[];
  controls: AnimationControls;
  motionX: MotionValue<number>;
  motionY: MotionValue<number>;
  motionScale: MotionValue<number>;
  onFit: () => void;
}

export default function Canvas({ nodes, controls, motionX, motionY, motionScale, onFit }: CanvasProps) {
  const hudScale = motionScale;

  const handleZoomIn = () => {
    const s = Math.min(motionScale.get() * 1.25, 4);
    motionScale.set(s);
  };

  const handleZoomOut = () => {
    const s = Math.max(motionScale.get() * 0.8, 0.08);
    motionScale.set(s);
  };

  return (
    <>
      <motion.div
        className="absolute top-0 left-0 origin-[0_0]"
        style={{ x: motionX, y: motionY, scale: motionScale }}
        animate={controls}
      >
        <StarField />
        <AnimatePresence>
          {nodes.map(node => (
            <NodeCard key={node.id} node={node}>
              <NodeContent node={node} />
            </NodeCard>
          ))}
        </AnimatePresence>
      </motion.div>

      <CanvasHUD
        motionScale={hudScale}
        nodeCount={nodes.length}
        onFit={onFit}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </>
  );
}
