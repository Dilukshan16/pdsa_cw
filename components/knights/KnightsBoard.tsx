'use client';

import { useMemo, useCallback } from 'react';
import { isKnightMove, getKnightMoves } from '@/lib/knights/helpers';

interface KnightsBoardProps {
  boardSize: number;
  moves: number[][];
  visitedSet: Set<string>;
  gameStatus: string;
  hintPath: number[][] | null;
  onMove: (x: number, y: number) => void;
}

export default function KnightsBoard({
  boardSize, moves, visitedSet, gameStatus, hintPath, onMove
}: KnightsBoardProps) {

  const [curX, curY] = moves.length > 0 ? moves[moves.length - 1] : [0, 0];

  const reachable = useMemo(() => {
    if (gameStatus !== 'PLAYING') return new Set<string>();
    return new Set(
      getKnightMoves(curX, curY, boardSize)
        .filter(([nx, ny]) => !visitedSet.has(`${nx},${ny}`))
        .map(([nx, ny]) => `${nx},${ny}`)
    );
  }, [curX, curY, boardSize, visitedSet, gameStatus]);

  const hintSet = useMemo(() => {
    if (!hintPath) return new Set<string>();
    return new Set(hintPath.map(([x, y]) => `${x},${y}`));
  }, [hintPath]);

  const handleClick = useCallback((x: number, y: number) => {
    if (gameStatus !== 'PLAYING') return;
    if (visitedSet.has(`${x},${y}`)) return;
    if (!isKnightMove(curX, curY, x, y)) return;
    onMove(x, y);
  }, [gameStatus, visitedSet, curX, curY, onMove]);

  const cellSize = boardSize === 8 ? 64 : 36;

  return (
    <div className="overflow-x-auto">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
          width: cellSize * boardSize,
          border: '3px solid #4a3728',
          borderRadius: 4,
        }}
      >
        {Array.from({ length: boardSize }, (_, row) =>
          Array.from({ length: boardSize }, (_, col) => {
            const isLight = (row + col) % 2 === 0;
            const key = `${col},${row}`;
            const isCurrent = col === curX && row === curY;
            const isVisited = visitedSet.has(key) && !isCurrent;
            const isReachable = reachable.has(key);
            const isHint = hintPath && hintSet.has(key) && !isCurrent && !isVisited;
            const moveIndex = moves.findIndex(([mx, my]) => mx === col && my === row);

            let bg = isLight ? '#f0d9b5' : '#b58863';
            if (isVisited) bg = isLight ? '#8bc48a' : '#5a9a58';
            if (isCurrent) bg = '#e8c84a';
            if (isReachable) bg = isLight ? '#b8d4f8' : '#7aaad4';
            if (isHint && !isCurrent) bg = '#fde68a';

            return (
              <div
                key={key}
                onClick={() => handleClick(col, row)}
                style={{
                  width: cellSize,
                  height: cellSize,
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isReachable && gameStatus === 'PLAYING' ? 'pointer' : 'default',
                  border: isReachable ? '2px solid rgba(37,99,235,0.6)' : '2px solid transparent',
                  fontSize: cellSize > 50 ? 13 : 10,
                  fontWeight: 600,
                  position: 'relative',
                  transition: 'background 0.15s',
                  userSelect: 'none',
                }}
              >
                {isCurrent && (
                  <span style={{ fontSize: cellSize > 50 ? 28 : 18 }}>♞</span>
                )}
                {isVisited && moveIndex >= 0 && (
                  <span style={{ color: isLight ? '#1a4a1a' : '#e8ffe8' }}>
                    {moveIndex + 1}
                  </span>
                )}
                {isHint && !isCurrent && (
                  <span style={{ fontSize: 16 }}>💡</span>
                )}
                {row === boardSize - 1 && (
                  <span style={{
                    position: 'absolute', bottom: 2, right: 3,
                    fontSize: 9, opacity: 0.6,
                    color: isLight ? '#b58863' : '#f0d9b5',
                  }}>
                    {String.fromCharCode(97 + col)}
                  </span>
                )}
                {col === 0 && (
                  <span style={{
                    position: 'absolute', top: 2, left: 3,
                    fontSize: 9, opacity: 0.6,
                    color: isLight ? '#b58863' : '#f0d9b5',
                  }}>
                    {boardSize - row}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}