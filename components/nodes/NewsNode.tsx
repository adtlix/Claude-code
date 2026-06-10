import type { CanvasNode } from '@/types';

interface NewsData {
  headline?: string;
  summary?: string;
  source?: string;
  category?: string;
}

export default function NewsNode({ node }: { node: CanvasNode }) {
  const isObj = typeof node.content === 'object' && node.content !== null;
  const data: NewsData = isObj ? (node.content as NewsData) : {};
  const text = typeof node.content === 'string' ? node.content : null;

  if (text) {
    return <p className="text-sm text-white/60 leading-relaxed">{text}</p>;
  }

  return (
    <div className="space-y-2.5">
      {data.category && (
        <span className="inline-block text-[10px] font-mono text-cyan-400/70 uppercase tracking-wider">
          {data.category}
        </span>
      )}
      {data.headline && (
        <p className="text-sm font-medium text-white/80 leading-snug">{data.headline}</p>
      )}
      {data.summary && (
        <p className="text-xs text-white/50 leading-relaxed">{data.summary}</p>
      )}
      {data.source && (
        <p className="text-[10px] text-white/25 font-mono pt-1 border-t border-white/[0.06]">
          {data.source}
        </p>
      )}
    </div>
  );
}
