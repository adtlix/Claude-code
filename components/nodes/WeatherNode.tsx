import type { CanvasNode } from '@/types';

interface WeatherData {
  temperature?: number | string;
  condition?: string;
  location?: string;
  humidity?: number | string;
  wind?: string;
  feels_like?: number | string;
}

export default function WeatherNode({ node }: { node: CanvasNode }) {
  const data: WeatherData =
    typeof node.content === 'object' && node.content !== null
      ? (node.content as WeatherData)
      : {};
  const text = typeof node.content === 'string' ? node.content : null;

  if (text) {
    return <p className="text-sm text-white/60 leading-relaxed">{text}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <span className="text-4xl font-mono font-light text-white tabular-nums">
          {data.temperature ?? '--'}
        </span>
        <span className="text-white/40 text-sm mb-1">{data.condition ?? ''}</span>
      </div>
      {data.location && (
        <p className="text-xs text-white/40 font-mono">{data.location}</p>
      )}
      {(data.humidity !== undefined || data.wind) && (
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/[0.06]">
          {data.humidity !== undefined && (
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Humidity</p>
              <p className="text-sm font-mono text-white/70">{data.humidity}%</p>
            </div>
          )}
          {data.wind && (
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Wind</p>
              <p className="text-sm font-mono text-white/70">{data.wind}</p>
            </div>
          )}
          {data.feels_like !== undefined && (
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Feels like</p>
              <p className="text-sm font-mono text-white/70">{data.feels_like}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
