'use client';

import { useEffect, useState } from 'react';
import { ComparisonRecord } from '@/lib/snake-ladder/api';

interface Props {
  games: ComparisonRecord[];
  averages: { BFS: number; Dijkstra: number };
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(max > 0 ? (value / max) * 100 : 0), 100);
    return () => clearTimeout(t);
  }, [value, max]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${w}%`, backgroundColor: color,
                   boxShadow: `0 0 6px ${color}66` }} />
      </div>
      <span className="w-16 text-xs font-mono text-right" style={{ color }}>
        {value} µs
      </span>
    </div>
  );
}

export default function ComparisonTable({ games, averages }: Props) {
  const allTimes = games.flatMap(g => [g.algorithmTimes.BFS, g.algorithmTimes.Dijkstra]);
  const maxTime = Math.max(...allTimes, 1);

  if (games.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="text-5xl mb-4">🎲</div>
        <p className="text-slate-400">No game records yet. Play a round to see comparisons!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Averages */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'BFS Average',      value: `${averages.BFS} µs`,  color: '#60a5fa', icon: '🔵' },
          { label: 'Dijkstra Average', value: `${averages.Dijkstra} µs`, color: '#a78bfa', icon: '🟣' },
          { label: 'Faster',
            value: averages.BFS <= averages.Dijkstra ? 'BFS' : 'Dijkstra',
            color: '#10b981', icon: '⚡' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-xs font-mono text-slate-500 uppercase mb-1">{s.label}</p>
            <p className="font-mono font-black text-2xl" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Per-game rows */}
      {games.map((g, i) => (
        <div key={g.gameId} className="glass rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-yellow-400 text-slate-900
                flex items-center justify-center text-xs font-bold font-mono">
                {i + 1}
              </span>
              <div>
                <p className="font-bold text-slate-200 text-sm">
                  {g.playerName || <span className="text-slate-600 italic">Anonymous</span>}
                </p>
                <p className="text-slate-600 text-xs font-mono">
                  {new Date(g.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <span className={`text-xs font-mono px-2 py-0.5 rounded border
              ${g.algorithmTimes.BFS <= g.algorithmTimes.Dijkstra
                ? 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                : 'text-purple-400 border-purple-500/30 bg-purple-500/10'}`}>
              {g.algorithmTimes.BFS <= g.algorithmTimes.Dijkstra ? 'BFS faster' : 'Dijkstra faster'}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-16 text-xs font-mono text-blue-400 text-right">BFS</span>
              <Bar value={g.algorithmTimes.BFS} max={maxTime} color="#60a5fa" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 text-xs font-mono text-purple-400 text-right">Dijkstra</span>
              <Bar value={g.algorithmTimes.Dijkstra} max={maxTime} color="#a78bfa" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}