'use client';

import { formatTime } from '@/lib/knights/helpers';

interface LoseModalProps {
  boardSize: number;
  moveCount: number;
  elapsedSeconds: number;
  onTryAgain: () => void;
  onQuit: () => void;
}

export default function LoseModal({
  boardSize, moveCount, elapsedSeconds, onTryAgain, onQuit
}: LoseModalProps) {
  const total = boardSize * boardSize;
  const pct = Math.round((moveCount / total) * 100);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: '#1a1a2e', border: '2px solid #dc2626',
        borderRadius: 16, padding: '40px 48px', textAlign: 'center',
        maxWidth: 400, width: '90%',
      }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>♞</div>
        <h2 style={{ color: '#dc2626', fontSize: 26, margin: '0 0 8px' }}>Knight is Stuck!</h2>
        <p style={{ color: '#aaa', marginBottom: 16 }}>
          No valid moves remaining. You covered {moveCount} of {total} squares ({pct}%).
        </p>
        <div style={{ color: '#888', fontFamily: 'monospace', fontSize: 18, marginBottom: 20 }}>
          Time: {formatTime(elapsedSeconds)}
        </div>
        <div style={{ background: '#333', borderRadius: 4, height: 10, marginBottom: 20 }}>
          <div style={{
            width: `${pct}%`, background: 'linear-gradient(90deg,#dc2626,#f97316)',
            height: '100%', borderRadius: 4,
          }} />
        </div>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
          Tip: Use the hint button — always move to the square with the fewest onward moves.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onTryAgain}
            style={{
              flex: 1, padding: 12, background: '#e8c84a', color: '#1a1a2e',
              border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}
          >
            Try Again
          </button>
          <button
            onClick={onQuit}
            style={{
              flex: 1, padding: 12, background: '#3a3a5e', color: '#ccc',
              border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}