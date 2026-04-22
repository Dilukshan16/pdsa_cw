'use client';

import { useEffect, useState } from 'react';
import { knightsApi, LeaderboardEntry } from '@/lib/knights/api';
import { formatTime } from '@/lib/knights/helpers';

export default function Leaderboard() {
  const [boardSize, setBoardSize] = useState(8);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    knightsApi.getLeaderboard(boardSize)
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [boardSize]);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div style={{
      background: '#1a1a2e', borderRadius: 16,
      border: '1px solid #3a3a5e', padding: 24, minWidth: 320,
    }}>
      <h2 style={{ color: '#e8c84a', margin: '0 0 16px', fontSize: 20, fontWeight: 700 }}>
        🏆 Leaderboard
      </h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[8, 16].map(size => (
          <button
            key={size}
            onClick={() => setBoardSize(size)}
            style={{
              flex: 1, padding: 8, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: boardSize === size ? '#e8c84a' : '#2a2a3e',
              color: boardSize === size ? '#1a1a2e' : '#aaa',
              fontWeight: 600, fontSize: 14,
            }}
          >
            {size}×{size}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '20px 0' }}>Loading...</p>
      ) : entries.length === 0 ? (
        <p style={{ color: '#555', textAlign: 'center', padding: '20px 0', fontSize: 14 }}>
          No scores yet. Be the first!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {entries.map((entry, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: i === 0 ? '#2a2200' : '#2a2a3e',
              borderRadius: 8, padding: '10px 14px',
              border: i === 0 ? '1px solid #e8c84a33' : '1px solid transparent',
            }}>
              <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>
                {medals[i] ?? `#${i + 1}`}
              </span>
              <span style={{ flex: 1, color: '#e0e0e0', fontWeight: 600 }}>
                {entry.playerName}
              </span>
              <span style={{ color: '#e8c84a', fontFamily: 'monospace', fontWeight: 700 }}>
                {entry.timeTakenSeconds ? formatTime(entry.timeTakenSeconds) : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}