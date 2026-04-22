'use client';

interface Props {
  timeLeft: number;
  totalTime?: number;
}

export default function TimerBar({ timeLeft, totalTime = 60 }: Props) {
  const pct = (timeLeft / totalTime) * 100;
  const color = timeLeft > 30 ? '#10b981' : timeLeft > 10 ? '#f9c840' : '#ef4444';

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Time Remaining
        </span>
        <span className="font-mono font-bold text-2xl" style={{ color }}>
          {timeLeft}s
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color,
                   boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
}