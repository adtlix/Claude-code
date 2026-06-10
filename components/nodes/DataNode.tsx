import type { CanvasNode } from '@/types';

function ValueDisplay({ value }: { value: unknown }) {
  if (typeof value === 'number') {
    return <span className="font-mono text-green-400">{value}</span>;
  }
  if (typeof value === 'boolean') {
    return <span className="font-mono text-orange-400">{String(value)}</span>;
  }
  if (value === null || value === undefined) {
    return <span className="font-mono text-white/25">null</span>;
  }
  return <span className="font-mono text-white/70">{String(value)}</span>;
}

export default function DataNode({ node }: { node: CanvasNode }) {
  const isObj = typeof node.content === 'object' && node.content !== null;
  const text = typeof node.content === 'string' ? node.content : null;

  if (text) {
    return (
      <p className="text-2xl font-mono font-light text-white/90 tabular-nums">{text}</p>
    );
  }

  const entries = isObj ? Object.entries(node.content as Record<string, unknown>) : [];

  return (
    <dl className="space-y-2">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-start justify-between gap-3">
          <dt className="text-[11px] text-white/30 font-mono shrink-0 mt-0.5">{key}</dt>
          <dd className="text-[12px] text-right break-all">
            <ValueDisplay value={value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
