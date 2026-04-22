'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { startGame } from '@/lib/snake-ladder/api';

const SIZES = [6, 7, 8, 9, 10, 11, 12];

export default function SnakeLadderHome() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [boardSize, setBoardSize]   = useState(8);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!playerName.trim())               return setError('Player name is required.');
    if (!/^[a-zA-Z\s]+$/.test(playerName)) return setError('Name must only contain letters and spaces.');
    setLoading(true);
    try {
      const data = await startGame(playerName.trim(), boardSize);
      sessionStorage.setItem('sl_gameData', JSON.stringify(data));
      router.push('/snake-ladder/game');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center mb-10">
        <div className="flex justify-center gap-3 mb-4 text-4xl">
          <span className="animate-bounce">🐍</span>
          <span className="animate-bounce delay-100">🎲</span>
          <span className="animate-bounce delay-200">🪜</span>
        </div>
        <h1 className="text-5xl font-black text-yellow-400 mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}>
          Snake & Ladder
        </h1>
        <p className="text-slate-400 font-mono tracking-widest text-sm uppercase">
          Algorithm Challenge · BFS vs Dijkstra
        </p>
      </div>

      <div className="glass rounded-2xl p-8 w-full max-w-md border border-white/10">
        <form onSubmit={handleStart} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Player Name
            </label>
            <input
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={40}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-white/10
                text-slate-100 placeholder-slate-600 focus:outline-none
                focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Board Size —{' '}
              <span className="text-yellow-400">{boardSize}×{boardSize}</span>
              <span className="text-slate-600 normal-case ml-1">
                ({boardSize * boardSize} cells · 🐍{boardSize-2} · 🪜{boardSize-2})
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button key={s} type="button" onClick={() => setBoardSize(s)}
                  className={`px-3 py-2 rounded-lg text-sm font-mono font-bold transition-all
                    ${boardSize === s
                      ? 'bg-yellow-400 text-slate-900 shadow-[0_0_15px_rgba(249,200,64,0.4)]'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-yellow-400/40'}`}>
                  {s}×{s}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20
              rounded-lg px-4 py-3">⚠ {error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-black text-lg bg-yellow-400 text-slate-900
              hover:bg-yellow-300 disabled:opacity-50 transition-all
              hover:shadow-[0_0_30px_rgba(249,200,64,0.4)]"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            {loading ? 'Generating Board...' : 'Roll the Dice 🎲'}
          </button>
        </form>
      </div>

      <Link href="/snake-ladder/comparison"
        className="mt-6 text-slate-500 hover:text-yellow-400 transition-colors
          text-sm font-mono flex items-center gap-2">
        📊 View Algorithm Comparison →
      </Link>
    </main>
  );
}