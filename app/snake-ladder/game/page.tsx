'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { solveGame, GameDataSL } from '@/lib/snake-ladder/api';
import GameBoard from '@/components/snake-ladder/GameBoard';
import ChoicePanel from '@/components/snake-ladder/ChoicePanel';
import TimerBar from '@/components/snake-ladder/TimerBar';

export default function GamePage() {
  const router = useRouter();
  const [gameData, setGameData]       = useState<GameDataSL | null>(null);
  const [selected, setSelected]       = useState<number | null>(null);
  const [submitted, setSubmitted]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [timeLeft, setTimeLeft]       = useState(60);

  useEffect(() => {
    const raw = sessionStorage.getItem('sl_gameData');
    if (!raw) { router.push('/snake-ladder'); return; }
    setGameData(JSON.parse(raw));
  }, [router]);

  const handleSubmit = useCallback(async (guess: number | null, timedOut = false) => {
    if (submitted || loading || !gameData) return;
    setLoading(true);
    try {
      const result = await solveGame(gameData.gameId, timedOut ? 0 : (guess ?? 0));
      sessionStorage.setItem('sl_result', JSON.stringify({
        ...result,
        playerName: gameData.playerName,
        boardSize: gameData.boardSize,
        timedOut,
      }));
      setSubmitted(true);
      setTimeout(() => router.push('/snake-ladder/result'), 600);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }, [submitted, loading, gameData, router]);

  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) { handleSubmit(null, true); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, submitted, handleSubmit]);

  if (!gameData) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-yellow-400 font-mono animate-pulse">Loading board...</p>
    </div>
  );

  const n = gameData.boardSize;

  return (
    <main className="min-h-screen px-4 py-8">
      {/* Nav */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <Link href="/snake-ladder"
          className="text-slate-500 hover:text-yellow-400 transition-colors text-sm font-mono">
          ← Back
        </Link>
        <span className="text-yellow-400 font-black text-xl"
          style={{ fontFamily: 'Playfair Display, serif' }}>Snake & Ladder</span>
        <span className="text-slate-400 text-sm font-mono">{gameData.playerName}</span>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col xl:flex-row gap-6 items-start justify-center">
        {/* Board */}
        <div className="glass rounded-2xl p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-mono text-slate-400">{n}×{n} · {n*n} cells</span>
            <div className="flex gap-3 text-xs font-mono">
              <span className="text-red-400">🐍 {Object.keys(gameData.snakes).length}</span>
              <span className="text-emerald-400">🪜 {Object.keys(gameData.ladders).length}</span>
            </div>
          </div>
          <GameBoard gameData={gameData} playerPosition={1} />
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col gap-4 w-full xl:max-w-sm">
          <TimerBar timeLeft={timeLeft} />

          {/* Question */}
          <div className="glass rounded-xl p-5">
            <p className="text-slate-200 text-base leading-relaxed">
              What is the{' '}
              <span className="text-yellow-400 font-bold">minimum dice throws</span>
              {' '}to reach cell{' '}
              <span className="font-mono font-bold text-yellow-400">{n*n}</span>
              {' '}from cell <span className="font-mono font-bold">1</span>?
            </p>
          </div>

          <ChoicePanel
            choices={gameData.choices}
            selected={selected}
            submitted={submitted}
            onSelect={setSelected}
          />

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              ⚠ {error}
            </p>
          )}

          <button
            onClick={() => handleSubmit(selected)}
            disabled={loading || submitted || selected === null}
            className="py-4 rounded-xl font-black text-lg bg-yellow-400 text-slate-900
              hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            {loading || submitted ? 'Submitting...' : 'Lock In Answer →'}
          </button>

          {/* Snake/Ladder cheat sheet */}
          <div className="glass rounded-xl p-4 text-xs font-mono space-y-3">
            <div>
              <p className="text-red-400 mb-1.5">🐍 Snakes (head → tail)</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(gameData.snakes).map(([h, t]) => (
                  <span key={h} className="bg-red-500/10 border border-red-500/20 text-red-300 px-2 py-0.5 rounded">
                    {h}→{t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-emerald-400 mb-1.5">🪜 Ladders (bottom → top)</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(gameData.ladders).map(([b, t]) => (
                  <span key={b} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    {b}→{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}