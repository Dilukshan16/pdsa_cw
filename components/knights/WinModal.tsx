'use client';

import { useState } from 'react';
import { knightsApi } from '@/lib/knights/api';
import { formatTime } from '@/lib/knights/helpers';

interface WinModalProps {
  boardSize: number;
  startX: number;
  startY: number;
  moves: number[][];
  elapsedSeconds: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export default function WinModal({
  boardSize, startX, startY, moves, elapsedSeconds, onPlayAgain, onClose
}: WinModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await knightsApi.submitSolution(
        playerName.trim(), boardSize, startX, startY, moves, elapsedSeconds
      );
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: '#1a1a2e', border: '2px solid #e8c84a',
        borderRadius: 16, padding: '40px 48px', textAlign: 'center',
        maxWidth: 420, width: '90%',
      }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>🏆</div>
        <h2 style={{ color: '#e8c84a', fontSize: 28, margin: '0 0 8px' }}>You Won!</h2>
        <p style={{ color: '#aaa', marginBottom: 4 }}>
          {boardSize}×{boardSize} board completed in
        </p>
        <div style={{ color: '#e8c84a', fontSize: 32, fontFamily: 'monospace', fontWeight: 700, marginBottom: 20 }}>
          {formatTime(elapsedSeconds)}
        </div>

        {!saved ? (
          <>
            <p style={{ color: '#aaa', fontSize: 13, marginBottom: 10 }}>
              Enter your name to save your score:
            </p>
            <input
              type="text"
              placeholder="Your name..."
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              maxLength={50}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                border: '2px solid #3a3a5e', background: '#2a2a3e',
                color: '#fff', fontSize: 16, marginBottom: 8,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            {error && (
              <p style={{ color: '#f87171', fontSize: 13, marginBottom: 8 }}>{error}</p>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: '100%', padding: 12, background: '#e8c84a',
                color: '#1a1a2e', border: 'none', borderRadius: 8,
                fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 10,
              }}
            >
              {saving ? 'Saving...' : '💾 Save Score'}
            </button>
          </>
        ) : (
          <div style={{
            background: '#0f3a1a', border: '1px solid #2a7a3a',
            borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#6dd98a',
          }}>
            ✓ Score saved to leaderboard!
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onPlayAgain}
            style={{
              flex: 1, padding: 11, background: '#2563eb', color: '#fff',
              border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}
          >
            Play Again
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: 11, background: '#3a3a5e', color: '#ccc',
              border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}
          >
            View Board
          </button>
        </div>
      </div>
    </div>
  );
}