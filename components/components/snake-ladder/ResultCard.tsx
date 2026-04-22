'use client';

interface Props {
  correct: boolean;
  timedOut: boolean;
  playerName: string;
  userGuess: number;
  minDiceThrows: number;
  boardSize: number;
}

export default function ResultCard({
  correct, timedOut, playerName, userGuess, minDiceThrows, boardSize
}: Props) {
  const outcome = timedOut ? 'timeout' : correct ? 'win' : 'lose';

  const config = {
    win:     { emoji: '🏆', label: 'Correct!',    color: '#f9c840' },
    lose:    { emoji: '💀', label: 'Incorrect',   color: '#ef4444' },
    timeout: { emoji: '⏰', label: "Time's Up!",  color: '#f97316' },
  }[outcome];

  return (
    <div className="glass rounded-2xl p-6 w-full border border-white/10 text-center">
      <div className="text-7xl mb-3"
        style={{ filter: `drop-shadow(0 0 24px ${config.color})` }}>
        {config.emoji}
      </div>
      <h2 className="text-5xl font-black mb-1"
        style={{ color: config.color, fontFamily: 'Playfair Display, serif' }}>
        {config.label}
      </h2>
      {correct && (
        <p className="text-sm text-yellow-400 font-mono mb-4">
          🏅 {playerName} recorded on the board!
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="glass rounded-xl p-4">
          <p className="text-xs font-mono text-slate-500 uppercase mb-2">Your Answer</p>
          <p className="font-mono text-4xl font-bold"
            style={{ color: correct ? '#10b981' : '#ef4444' }}>
            {timedOut ? '—' : userGuess}
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-xs font-mono text-slate-500 uppercase mb-2">Correct Answer</p>
          <p className="font-mono text-4xl font-bold text-yellow-400">{minDiceThrows}</p>
        </div>
      </div>
    </div>
  );
}