'use client';

import { useMemo } from 'react';
import { GameDataSL } from '@/lib/snake-ladder/api';

interface Props {
  gameData: GameDataSL;
  playerPosition?: number;
}

function cellToPosition(cell: number, n: number) {
  const idx = cell - 1;
  const row = Math.floor(idx / n);
  const col = idx % n;
  const actualCol = row % 2 === 0 ? col : n - 1 - col;
  return { row: n - 1 - row, col: actualCol };
}

function cellCenter(cell: number, n: number, size: number) {
  const { row, col } = cellToPosition(cell, n);
  return { x: col * size + size / 2, y: row * size + size / 2 };
}

export default function GameBoard({ gameData, playerPosition }: Props) {
  const n = gameData.boardSize;
  const snakes = gameData.snakes || {};
  const ladders = gameData.ladders || {};
  const total = n * n;
  const cellSize = Math.min(Math.floor(560 / n), 68);
  const boardPx = cellSize * n;

  const cells = useMemo(() => {
    return Array.from({ length: total }, (_, i) => {
      const num = i + 1;
      const pos = cellToPosition(num, n);
      return {
        num, pos,
        isSnakeHead: snakes[num] !== undefined,
        isLadderBottom: ladders[num] !== undefined,
        isStart: num === 1,
        isEnd: num === total,
      };
    });
  }, [n, snakes, ladders, total]);

  return (
    <div className="overflow-auto rounded-xl border border-white/10">
      <svg width={boardPx} height={boardPx}>
        {/* Cell backgrounds */}
        {cells.map(c => {
          const x = c.pos.col * cellSize;
          const y = c.pos.row * cellSize;
          const dark = (c.pos.row + c.pos.col) % 2 === 0;
          let fill = dark ? '#0d1f3c' : '#071428';
          if (c.isStart) fill = 'rgba(16,185,129,0.18)';
          if (c.isEnd)   fill = 'rgba(249,200,64,0.18)';
          return (
            <rect key={c.num} x={x} y={y}
              width={cellSize} height={cellSize}
              fill={fill} stroke="rgba(249,200,64,0.07)" strokeWidth="0.5" />
          );
        })}

        {/* Ladders */}
        {Object.entries(ladders).map(([b, top]) => {
          const bNum = parseInt(b);
          const bp = cellCenter(bNum, n, cellSize);
          const tp = cellCenter(top, n, cellSize);
          const dx = tp.x - bp.x; const dy = tp.y - bp.y;
          const len = Math.sqrt(dx*dx + dy*dy);
          const ux = -dy/len*5; const uy = dx/len*5;
          return (
            <g key={`l-${b}`}>
              <line x1={bp.x+ux} y1={bp.y+uy} x2={tp.x+ux} y2={tp.y+uy}
                stroke="#10b981" strokeWidth="3" strokeOpacity="0.8" strokeLinecap="round"/>
              <line x1={bp.x-ux} y1={bp.y-uy} x2={tp.x-ux} y2={tp.y-uy}
                stroke="#10b981" strokeWidth="3" strokeOpacity="0.8" strokeLinecap="round"/>
              {[1,2,3,4].map(i => {
                const t = i/5;
                return <line key={i}
                  x1={bp.x+dx*t+ux} y1={bp.y+dy*t+uy}
                  x2={bp.x+dx*t-ux} y2={bp.y+dy*t-uy}
                  stroke="#10b981" strokeWidth="2" strokeOpacity="0.5"/>;
              })}
              <circle cx={bp.x} cy={bp.y} r="5" fill="#10b981" opacity="0.9"/>
              <circle cx={tp.x} cy={tp.y} r="5" fill="#34d399" opacity="0.9"/>
            </g>
          );
        })}

        {/* Snakes */}
        {Object.entries(snakes).map(([h, tail]) => {
          const hNum = parseInt(h);
          const hp = cellCenter(hNum, n, cellSize);
          const tp = cellCenter(tail, n, cellSize);
          const dx = tp.x-hp.x; const dy = tp.y-hp.y;
          const cx1 = hp.x+dx*0.3+dy*0.3; const cy1 = hp.y+dy*0.3-dx*0.3;
          const cx2 = hp.x+dx*0.7-dy*0.3; const cy2 = hp.y+dy*0.7+dx*0.3;
          const d = `M ${hp.x} ${hp.y} C ${cx1} ${cy1},${cx2} ${cy2},${tp.x} ${tp.y}`;
          return (
            <g key={`s-${h}`}>
              <path d={d} stroke="#ef4444" strokeWidth="10" fill="none" strokeOpacity="0.1" strokeLinecap="round"/>
              <path d={d} stroke="#ef4444" strokeWidth="5" fill="none" strokeOpacity="0.85" strokeLinecap="round"/>
              <path d={d} stroke="#fca5a5" strokeWidth="2" fill="none" strokeOpacity="0.4"
                strokeDasharray="3 8" strokeLinecap="round"/>
              <circle cx={hp.x} cy={hp.y} r="7" fill="#ef4444"/>
              <circle cx={hp.x} cy={hp.y} r="4" fill="#fca5a5" opacity="0.7"/>
              <circle cx={tp.x} cy={tp.y} r="3" fill="#ef4444" opacity="0.6"/>
            </g>
          );
        })}

        {/* Cell numbers */}
        {cells.map(c => (
          <text key={`n-${c.num}`}
            x={c.pos.col*cellSize + cellSize/2}
            y={c.pos.row*cellSize + cellSize*0.92}
            textAnchor="middle"
            fontSize={Math.max(8, cellSize*0.22)}
            fill={c.isStart ? '#10b981' : c.isEnd ? '#f9c840' :
                  c.isSnakeHead ? '#fca5a5' : c.isLadderBottom ? '#6ee7b7' :
                  'rgba(148,163,184,0.35)'}
            fontFamily="JetBrains Mono, monospace" fontWeight="500">
            {c.num}
          </text>
        ))}

        {/* START / END labels */}
        {(() => {
          const sp = cellCenter(1, n, cellSize);
          const ep = cellCenter(total, n, cellSize);
          const fs = Math.max(7, cellSize * 0.18);
          return <>
            <text x={sp.x} y={sp.y - cellSize*0.15} textAnchor="middle"
              fontSize={fs} fill="#10b981" fontFamily="JetBrains Mono, monospace" fontWeight="700">START</text>
            <text x={ep.x} y={ep.y - cellSize*0.15} textAnchor="middle"
              fontSize={fs} fill="#f9c840" fontFamily="JetBrains Mono, monospace" fontWeight="700">END ★</text>
          </>;
        })()}

        {/* Player token */}
        {playerPosition && (() => {
          const p = cellCenter(playerPosition, n, cellSize);
          return (
            <g>
              <circle cx={p.x} cy={p.y} r={cellSize*0.22} fill="url(#tok)" stroke="#040d1a" strokeWidth="2"/>
              <circle cx={p.x} cy={p.y} r={cellSize*0.28} fill="none" stroke="#f9c840" strokeWidth="1.5" strokeOpacity="0.5"/>
              <text x={p.x} y={p.y+4} textAnchor="middle" fontSize={cellSize*0.22}
                fill="#040d1a" fontWeight="bold" fontFamily="JetBrains Mono, monospace">★</text>
            </g>
          );
        })()}

        <defs>
          <radialGradient id="tok" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#fde68a"/>
            <stop offset="60%" stopColor="#f9c840"/>
            <stop offset="100%" stopColor="#e6a800"/>
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}