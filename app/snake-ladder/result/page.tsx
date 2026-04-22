'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ResultCard from '@/components/snake-ladder/ResultCard';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('sl_result');
    if (!raw) { router.push('/snake-ladder'); return; }
    setResult(JSON.parse(raw));
  }, [router]);

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-yellow-400 font-mono animate-pulse">Loading result...</p>
    </div>
  );

  const { correct, timedOut, playerName, minDiceThrows,
          userGuess, algorithmTimes, boardSize } = result;
  const bfs  = algorithmTimes?.BFS ?? 0;
  const dijk = algorithmTimes?.Dijkstra ?? 0;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-4">
        <ResultCard
          correct={correct} timedOut={timedOut} playerName={playerName}
          userGuess={userGuess} minDiceThrows={minDiceThrows} boardSize={boardSize}
        />

        {/* Algorithm timing */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h3 className="text-center text-xs font-mono text-slate-400 uppercase tracking-widest mb-5">
            Algorithm Performance
          </h3>
          {[
            { name: 'BFS',      time: bfs,  color: '#60a5fa' },
            { name: 'Dijkstra', time: dijk, color: '#a78bfa' },
          ].map(a => (
            <div key={a.name} className="mb-4">
              <div className="flex justify-between mb-1.5">
                <span className="font-mono text-sm font-bold" style={{ color: a.color }}>
                  {a.name}
                  {((a.name === 'BFS' && bfs <= dijk) || (a.name === 'Dijkstra' && dijk < bfs)) && (
                    <span className="ml-2 text-xs bg-emerald-500/15 border border-emerald-500/30
                      text-emerald-400 px-2 py-0.5 rounded font-mono">faster</span>
                  )}
                </span>
                <span className="font-mono text-sm font-bold" style={{ color: a.color }}>
                  {a.time} µs
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${(a.time / Math.max(bfs, dijk, 1)) * 100}%`,
                    backgroundColor: a.color,
                    boxShadow: `0 0 8px ${a.color}66`
                  }} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href="/snake-ladder"
            onClick={() => {
              sessionStorage.removeItem('sl_gameData');
              sessionStorage.removeItem('sl_result');
            }}
            className="flex-1 py-4 rounded-xl font-black text-lg text-center
              bg-yellow-400 text-slate-900 hover:bg-yellow-300 transition-all"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Play Again 🎲
          </Link>
          <Link href="/snake-ladder/comparison"
            className="flex-1 py-4 rounded-xl font-black text-lg text-center glass
              text-slate-300 border border-slate-700 hover:border-yellow-400/40 transition-all"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Leaderboard 📊
          </Link>
        </div>
      </div>
    </main>
  );
}