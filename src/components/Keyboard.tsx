import { Delete } from 'lucide-react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
}

export default function Keyboard({ onKeyPress, onBackspace }: KeyboardProps) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="flex flex-col gap-2 p-2 bg-black/10 dark:bg-white/5 rounded-t-2xl w-full max-w-md mx-auto mt-auto">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.map(key => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="flex-1 py-3 bg-[var(--c-surface)] text-[var(--c-text)] font-bold rounded-lg shadow-sm active:scale-95 transition-transform text-lg"
              style={{ maxWidth: i === 1 ? '9%' : '10%' }}
            >
              {key}
            </button>
          ))}
          {i === 2 && (
            <button
              onClick={onBackspace}
              className="flex items-center justify-center px-4 bg-[var(--c-surface)] text-[var(--c-text)] rounded-lg shadow-sm active:scale-95 transition-transform"
            >
              <Delete size={20} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
