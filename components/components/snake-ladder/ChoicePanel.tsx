'use client';

interface Props {
  choices: number[];
  selected: number | null;
  submitted: boolean;
  onSelect: (choice: number) => void;
}

const LABELS = ['A', 'B', 'C'];

export default function ChoicePanel({ choices, selected, submitted, onSelect }: Props) {
  return (
    <div className="glass rounded-xl p-4">
      <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
        Choose your answer
      </p>
      <div className="space-y-3">
        {choices.map((choice, idx) => {
          const isSelected = selected === choice;
          return (
            <button
              key={choice}
              onClick={() => !submitted && onSelect(choice)}
              disabled={submitted}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 transition-all duration-200
                ${isSelected
                  ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_20px_rgba(249,200,64,0.2)]'
                  : 'border-white/10 bg-slate-900/50 hover:border-yellow-400/40 hover:bg-slate-800/70'}
                ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center
                text-sm font-bold font-mono flex-shrink-0 transition-all
                ${isSelected ? 'bg-yellow-400 text-slate-900' : 'bg-slate-800 text-slate-400 border border-slate-600'}`}>
                {LABELS[idx]}
              </span>
              <span className={`font-mono text-xl font-bold
                ${isSelected ? 'text-yellow-400' : 'text-slate-300'}`}>
                {choice} throws
              </span>
              {isSelected && <span className="ml-auto text-yellow-400">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}