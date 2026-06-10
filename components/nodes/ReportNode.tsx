import type { CanvasNode } from '@/types';

interface ReportData {
  summary?: string;
  details?: string[];
  score?: number;
  source?: string;
}

export default function ReportNode({ node }: { node: CanvasNode }) {
  const isObj = typeof node.content === 'object' && node.content !== null;
  const data: ReportData = isObj ? (node.content as ReportData) : {};
  const text = typeof node.content === 'string' ? node.content : null;

  if (text) {
    const paragraphs = text.split(/\n\n+/);
    return (
      <div className="space-y-2">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-white/60 leading-relaxed">
            {p.replace(/\*\*(.+?)\*\*/g, '$1')}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.summary && (
        <p className="text-sm text-white/70 leading-relaxed">{data.summary}</p>
      )}
      {data.details && data.details.length > 0 && (
        <ul className="space-y-1.5">
          {data.details.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-white/50">
              <span className="text-purple-400 mt-0.5 shrink-0">+</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {data.score !== undefined && (
        <div className="pt-2 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Score</span>
            <span className="text-xs font-mono text-white/60">{data.score}/10</span>
          </div>
          <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
              style={{ width: `${(data.score / 10) * 100}%` }}
            />
          </div>
        </div>
      )}
      {data.source && (
        <p className="text-[10px] text-white/25 font-mono">{data.source}</p>
      )}
    </div>
  );
}
