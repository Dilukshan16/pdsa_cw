'use client';

import { useEffect, useRef, useState } from 'react';
import { ComparisonRecord } from '@/lib/snake-ladder/api';

interface Props {
  games: ComparisonRecord[];
  averages: { BFS: number; Dijkstra: number };
}

// ── Animated bar ──────────────────────────────────────────────────────────────
function AnimBar({
  value, max, color, delay = 0,
}: { value: number; max: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(max > 0 ? (value / max) * 100 : 0), delay);
    return () => clearTimeout(t);
  }, [value, max, delay]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}55`,
            transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
      <span className="text-xs font-mono w-14 text-right"
        style={{ color, fontFamily: 'JetBrains Mono, monospace' }}>
        {value} µs
      </span>
    </div>
  );
}

// ── Sparkline SVG ─────────────────────────────────────────────────────────────
function Sparkline({
  data, color, height = 36,
}: { data: number[]; color: string; height?: number }) {
  if (data.length < 2) return null;
  const w = 120;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }));
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`}
      style={{ overflow: 'visible' }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y}
        r="2.5" fill={color} />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ComparisonTable({ games, averages }: Props) {
  const allBfs   = games.map(g => g.algorithmTimes.BFS);
  const allDijk  = games.map(g => g.algorithmTimes.Dijkstra);
  const maxTime  = Math.max(...allBfs, ...allDijk, 1);

  const bfsFasterCount   = games.filter(g => g.algorithmTimes.BFS <= g.algorithmTimes.Dijkstra).length;
  const dijkFasterCount  = games.length - bfsFasterCount;
  const fasterOverall    = averages.BFS <= averages.Dijkstra ? 'BFS' : 'Dijkstra';
  const diffPct = averages.BFS > 0
    ? Math.round(Math.abs(averages.BFS - averages.Dijkstra) / Math.min(averages.BFS, averages.Dijkstra) * 100)
    : 0;

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-6xl opacity-40">🎲</div>
        <p className="text-slate-400 font-mono text-sm"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          No game records yet — play a round to see comparisons.
        </p>
      </div>
    );
  }

  // ── Summary strip ────────────────────────────────────────────────────────────
  const summaryCards = [
    {
      label: 'BFS average',
      value: `${averages.BFS} µs`,
      sub: `${bfsFasterCount}/${games.length} rounds faster`,
      color: '#60a5fa',
      spark: allBfs,
    },
    {
      label: 'Dijkstra average',
      value: `${averages.Dijkstra} µs`,
      sub: `${dijkFasterCount}/${games.length} rounds faster`,
      color: '#a78bfa',
      spark: allDijk,
    },
    {
      label: 'Overall winner',
      value: fasterOverall,
      sub: `${diffPct}% fewer operations on avg`,
      color: '#34d399',
      spark: null,
    },
    {
      label: 'Rounds analysed',
      value: `${games.length}`,
      sub: 'last games recorded',
      color: '#f9c840',
      spark: null,
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Summary cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((c, i) => (
          <div
            key={c.label}
            className="rounded-xl p-4 border"
            style={{
              background: 'rgba(13,31,60,0.7)',
              borderColor: `${c.color}22`,
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <p className="text-xs font-mono uppercase tracking-widest mb-2"
              style={{ color: 'rgba(148,163,184,0.7)',
                fontFamily: 'JetBrains Mono, monospace' }}>
              {c.label}
            </p>
            <div className="flex items-end justify-between gap-2">
              <p className="font-mono font-bold text-2xl leading-none"
                style={{ color: c.color,
                  fontFamily: 'JetBrains Mono, monospace' }}>
                {c.value}
              </p>
              {c.spark && (
                <Sparkline data={c.spark} color={c.color} />
              )}
            </div>
            <p className="text-xs mt-2"
              style={{ color: 'rgba(148,163,184,0.5)',
                fontFamily: 'JetBrains Mono, monospace' }}>
              {c.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Head-to-head aggregate bar ───────────────────────────────────── */}
      <div
        className="rounded-xl p-5 border"
        style={{
          background: 'rgba(13,31,60,0.7)',
          borderColor: 'rgba(249,200,64,0.1)',
        }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Head-to-head — average execution time
        </p>

        <div className="space-y-3">
          {[
            { name: 'BFS', value: averages.BFS,      color: '#60a5fa', desc: 'Breadth-First Search · O(V+E)' },
            { name: 'Dijkstra', value: averages.Dijkstra, color: '#a78bfa', desc: "Dijkstra's Algorithm · O((V+E) log V)" },
          ].map((algo, i) => {
            const pct = Math.round((algo.value / Math.max(averages.BFS, averages.Dijkstra, 1)) * 100);
            const isFaster = (algo.name === 'BFS' && averages.BFS <= averages.Dijkstra)
              || (algo.name === 'Dijkstra' && averages.Dijkstra < averages.BFS);
            return (
              <div key={algo.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm w-16"
                      style={{ color: algo.color,
                        fontFamily: 'JetBrains Mono, monospace' }}>
                      {algo.name}
                    </span>
                    <span className="text-xs text-slate-500 hidden sm:block"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {algo.desc}
                    </span>
                    {isFaster && (
                      <span
                        className="text-xs px-2 py-0.5 rounded font-mono"
                        style={{
                          background: 'rgba(52,211,153,0.12)',
                          border: '1px solid rgba(52,211,153,0.25)',
                          color: '#34d399',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        faster
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-sm"
                    style={{ color: algo.color,
                      fontFamily: 'JetBrains Mono, monospace' }}>
                    {algo.value} µs
                  </span>
                </div>
                <div className="h-3 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <BarAnimate pct={pct} color={algo.color} delay={i * 200} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Win ratio pills */}
        <div className="flex gap-2 mt-4">
          <div className="flex-1 rounded-lg py-2 text-center text-xs font-mono"
            style={{
              background: 'rgba(96,165,250,0.08)',
              border: '1px solid rgba(96,165,250,0.2)',
              color: '#60a5fa',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
            BFS faster in {bfsFasterCount} rounds
          </div>
          <div className="flex-1 rounded-lg py-2 text-center text-xs font-mono"
            style={{
              background: 'rgba(167,139,250,0.08)',
              border: '1px solid rgba(167,139,250,0.2)',
              color: '#a78bfa',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
            Dijkstra faster in {dijkFasterCount} rounds
          </div>
        </div>
      </div>

      {/* ── Per-round rows ───────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Per-round breakdown
        </p>
        <div className="space-y-2">
          {games.map((game, idx) => {
            const bfs  = game.algorithmTimes.BFS;
            const dijk = game.algorithmTimes.Dijkstra;
            const bfsFaster = bfs <= dijk;
            const date = game.createdAt
              ? new Date(game.createdAt).toLocaleString('en-US', {
                  month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })
              : '—';

            return (
              <div
                key={game.gameId || idx}
                className="rounded-xl p-4 border transition-all duration-300 hover:border-yellow-400/20"
                style={{
                  background: 'rgba(13,31,60,0.6)',
                  borderColor: 'rgba(255,255,255,0.06)',
                  animationDelay: `${idx * 0.05}s`,
                }}
              >
                {/* Row header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center
                        text-xs font-bold font-mono flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg,#f9c840,#e6a800)',
                        color: '#040d1a',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-200"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        {game.playerName || (
                          <span className="text-slate-600 italic text-xs">Anonymous</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-600 font-mono"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {date}
                      </p>
                    </div>
                  </div>

                  {/* Δ diff badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{
                        background: bfsFaster
                          ? 'rgba(96,165,250,0.1)' : 'rgba(167,139,250,0.1)',
                        border: `1px solid ${bfsFaster
                          ? 'rgba(96,165,250,0.25)' : 'rgba(167,139,250,0.25)'}`,
                        color: bfsFaster ? '#60a5fa' : '#a78bfa',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      {bfsFaster ? 'BFS' : 'Dijkstra'} faster by {Math.abs(bfs - dijk)} µs
                    </span>
                  </div>
                </div>

                {/* Bars */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono w-14 text-right"
                      style={{ color: '#60a5fa',
                        fontFamily: 'JetBrains Mono, monospace' }}>
                      BFS
                    </span>
                    <AnimBar value={bfs} max={maxTime} color="#60a5fa" delay={idx * 60} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono w-14 text-right"
                      style={{ color: '#a78bfa',
                        fontFamily: 'JetBrains Mono, monospace' }}>
                      Dijkstra
                    </span>
                    <AnimBar value={dijk} max={maxTime} color="#a78bfa" delay={idx * 60 + 100} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footnote ─────────────────────────────────────────────────────── */}
      <p className="text-center text-xs text-slate-600 font-mono pb-2"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        Times in microseconds (µs) · Both algorithms always compute the same minimum answer
      </p>
    </div>
  );
}

// ── Internal animated bar (avoids hook-in-loop) ───────────────────────────────
function BarAnimate({
  pct, color, delay,
}: { pct: number; color: string; delay: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div
      className="h-full rounded-full"
      style={{
        width: `${w}%`,
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}44`,
        transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
      }}
    />
  );
}