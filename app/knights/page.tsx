'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { knightsApi } from '@/lib/knights/api';
import { isKnightMove, isStuck, formatTime } from '@/lib/knights/helpers';
import KnightsBoard from '@/components/knights/KnightsBoard';
import WinModal from '@/components/knights/WinModal';
import LoseModal from '@/components/knights/LoseModal';
import Leaderboard from '@/components/knights/LeaderBoard';

type GameStatus = 'IDLE' | 'PLAYING' | 'WIN' | 'LOSE';
type Algorithm = 'WARNSDORFF' | 'BACKTRACKING';

export default function KnightsPage() {
  // ── Game state ──────────────────────────────────────────
  const [boardSize, setBoardSize] = useState<number>(8);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [moves, setMoves] = useState<number[][]>([]);
  const [visitedSet, setVisitedSet] = useState<Set<string>>(new Set());
  const [gameStatus, setGameStatus] = useState<GameStatus>('IDLE');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [hintPath, setHintPath] = useState<number[][] | null>(null);
  const [algorithm, setAlgorithm] = useState<Algorithm>('WARNSDORFF');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Timer ───────────────────────────────────────────────
  useEffect(() => {
    if (gameStatus === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  // ── Start game ──────────────────────────────────────────
  const handleStart = async (size: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await knightsApi.startGame(size);
      const key = `${data.startX},${data.startY}`;
      setStartX(data.startX);
      setStartY(data.startY);
      setBoardSize(data.boardSize);
      setMoves([[data.startX, data.startY]]);
      setVisitedSet(new Set([key]));
      setGameStatus('PLAYING');
      setElapsedSeconds(0);
      setHintPath(null);
    } catch {
      setError('Could not connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // ── Handle move ─────────────────────────────────────────
  const handleMove = useCallback((x: number, y: number) => {
    setMoves(prev => {
      const [curX, curY] = prev[prev.length - 1];
      if (!isKnightMove(curX, curY, x, y)) return prev;
      const newMoves = [...prev, [x, y]];
      const newVisited = new Set(visitedSet);
      newVisited.add(`${x},${y}`);
      setVisitedSet(newVisited);
      setHintPath(null);

      if (newMoves.length === boardSize * boardSize) {
        setGameStatus('WIN');
      } else if (isStuck(x, y, boardSize, newVisited)) {
        setGameStatus('LOSE');
      }

      return newMoves;
    });
  }, [visitedSet, boardSize]);

  // ── Undo ────────────────────────────────────────────────
  const handleUndo = () => {
    if (moves.length <= 1) return;
    const last = moves[moves.length - 1];
    const newVisited = new Set(visitedSet);
    newVisited.delete(`${last[0]},${last[1]}`);
    setVisitedSet(newVisited);
    setMoves(prev => prev.slice(0, -1));
    setHintPath(null);
  };

  // ── Hint ────────────────────────────────────────────────
  const handleHint = async () => {
    if (moves.length === 0) return;
    const [curX, curY] = moves[moves.length - 1];
    try {
      const data = await knightsApi.getHint(boardSize, curX, curY, algorithm);
      setHintPath(data.fullSolution);
    } catch {
      setError('Could not get hint');
    }
  };

  // ── Play again ──────────────────────────────────────────
  const handlePlayAgain = () => handleStart(boardSize);

  const handleQuit = () => {
    setGameStatus('IDLE');
    setMoves([]);
    setVisitedSet(new Set());
    setHintPath(null);
    setElapsedSeconds(0);
  };

  const progress = moves.length;
  const total = boardSize * boardSize;

  // ── IDLE screen ─────────────────────────────────────────
  if (gameStatus === 'IDLE') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#0f0f1a,#1a1a2e,#16213e)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', gap: 40,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 8 }}>♞</div>
          <h1 style={{
            color: '#e8c84a', fontSize: 42, fontWeight: 800,
            margin: 0, letterSpacing: '-1px',
          }}>
            Knight&apos;s Tour
          </h1>
          <p style={{ color: '#888', fontSize: 16, marginTop: 8 }}>
            Visit every square on the board exactly once
          </p>
        </div>

        <div style={{
          background: '#1a1a2e', border: '1px solid #3a3a5e',
          borderRadius: 20, padding: '32px 40px', minWidth: 320, textAlign: 'center',
        }}>
          <h3 style={{ color: '#ccc', marginTop: 0, marginBottom: 20 }}>Select Board Size</h3>

          <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
            {[8, 16].map(size => (
              <button
                key={size}
                onClick={() => setBoardSize(size)}
                style={{
                  flex: 1, padding: '20px 10px', borderRadius: 12,
                  border: boardSize === size ? '2px solid #e8c84a' : '2px solid #3a3a5e',
                  background: boardSize === size ? '#2a2200' : '#2a2a3e',
                  color: boardSize === size ? '#e8c84a' : '#888',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 20 }}>{size}×{size}</div>
                <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>
                  {size === 8 ? '64 squares' : '256 squares'}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{error}</p>
          )}

          <button
            onClick={() => handleStart(boardSize)}
            disabled={loading}
            style={{
              width: '100%', padding: 14, background: '#e8c84a',
              color: '#1a1a2e', border: 'none', borderRadius: 10,
              fontWeight: 800, fontSize: 18, cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Starting...' : 'Start Game →'}
          </button>
        </div>

        <Leaderboard />
      </div>
    );
  }

  // ── PLAYING / WIN / LOSE screen ─────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0f0f1a,#1a1a2e,#16213e)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: '1px solid #2a2a3e',
      }}>
        <button
          onClick={handleQuit}
          style={{ background: 'none', border: 'none', color: '#e8c84a', fontSize: 22, cursor: 'pointer' }}
        >
          ♞
        </button>
        <h1 style={{ color: '#e8c84a', margin: 0, fontSize: 20, fontWeight: 700 }}>
          Knight&apos;s Tour
        </h1>
        <span style={{
          background: '#2a2a3e', color: '#aaa',
          padding: '4px 12px', borderRadius: 20, fontSize: 13,
        }}>
          {boardSize}×{boardSize}
        </span>
      </header>

      {/* Main */}
      <main style={{
        flex: 1, display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', gap: 32, padding: '32px 20px', flexWrap: 'wrap',
      }}>
        <KnightsBoard
          boardSize={boardSize}
          moves={moves}
          visitedSet={visitedSet}
          gameStatus={gameStatus}
          hintPath={hintPath}
          onMove={handleMove}
        />

        {/* Controls panel */}
        <div style={{ minWidth: 240, maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Timer */}
          <div style={{
            background: '#1a1a2e', color: '#e8c84a', borderRadius: 10,
            padding: '10px 20px', textAlign: 'center',
            fontFamily: 'monospace', fontSize: 28, fontWeight: 700, letterSpacing: 2,
          }}>
            {formatTime(elapsedSeconds)}
          </div>

          {/* Progress */}
          <div style={{ background: '#2a2a3e', borderRadius: 10, padding: '10px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: '#ccc' }}>
              <span>Progress</span>
              <span style={{ color: '#e8c84a', fontWeight: 700 }}>{progress} / {total}</span>
            </div>
            <div style={{ background: '#444', borderRadius: 4, height: 8 }}>
              <div style={{
                width: `${(progress / total) * 100}%`,
                background: 'linear-gradient(90deg,#e8c84a,#f0a030)',
                height: '100%', borderRadius: 4, transition: 'width 0.3s',
              }} />
            </div>
          </div>

          {/* Algorithm selector */}
          <div style={{ background: '#2a2a3e', borderRadius: 10, padding: '10px 16px' }}>
            <p style={{ color: '#aaa', fontSize: 12, margin: '0 0 8px' }}>Hint algorithm</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['WARNSDORFF', 'BACKTRACKING'] as Algorithm[]).map(algo => (
                <button
                  key={algo}
                  onClick={() => setAlgorithm(algo)}
                  style={{
                    flex: 1, fontSize: 11, padding: '6px 8px',
                    borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: algorithm === algo ? '#e8c84a' : '#3a3a5e',
                    color: algorithm === algo ? '#1a1a2e' : '#ccc',
                    fontWeight: 600,
                  }}
                >
                  {algo === 'WARNSDORFF' ? 'Warnsdorff' : 'Backtracking'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleUndo}
            disabled={moves.length <= 1 || gameStatus !== 'PLAYING'}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: '#3a3a5e', color: '#ddd', fontWeight: 600,
              fontSize: 14, cursor: 'pointer',
              opacity: moves.length <= 1 ? 0.4 : 1,
            }}
          >
            ↩ Undo Move
          </button>

          <button
            onClick={handleHint}
            disabled={gameStatus !== 'PLAYING'}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: '#2563eb', color: '#fff',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}
          >
            💡 Get Hint
          </button>

          <button
            onClick={handleQuit}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: '#dc2626', color: '#fff',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}
          >
            ✕ Quit Game
          </button>
        </div>
      </main>

      {/* Modals */}
      {gameStatus === 'WIN' && (
        <WinModal
          boardSize={boardSize}
          startX={startX}
          startY={startY}
          moves={moves}
          elapsedSeconds={elapsedSeconds}
          onPlayAgain={handlePlayAgain}
          onClose={() => setGameStatus('PLAYING')}
        />
      )}
      {gameStatus === 'LOSE' && (
        <LoseModal
          boardSize={boardSize}
          moveCount={moves.length}
          elapsedSeconds={elapsedSeconds}
          onTryAgain={handlePlayAgain}
          onQuit={handleQuit}
        />
      )}
    </div>
  );
}