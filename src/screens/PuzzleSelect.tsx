import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getPuzzlesForAgeGroup, THEME_ICONS } from '../data';

export default function PuzzleSelect() {
  const { player, setScreen, startPuzzle } = useStore();
  if (!player) return null;
  const validAgeGroup = ['4-5', '6-8', '9-11', '12-15', '15-18', '18+'].includes(player.ageGroup) ? player.ageGroup : '9-11';
  const puzzles = getPuzzlesForAgeGroup(validAgeGroup as any);

  return (
    <div className="bg-app min-h-dvh flex flex-col px-5 py-8 gap-6 max-w-md mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => setScreen('dashboard')}
          className="p-2 rounded-xl transition-colors"
          style={{ background: 'var(--c-surface)', color: 'var(--c-text)' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-head text-app text-2xl font-black" style={{ fontFamily: 'var(--font-head)' }}>
          Choose a Puzzle 🎯
        </h1>
      </div>

      <motion.div
        className="flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {puzzles.map(puzzle => {
          const done = player.completedPuzzleIds.includes(puzzle.id);
          return (
            <motion.button
              key={puzzle.id}
              variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startPuzzle(puzzle)}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all w-full"
              style={{
                background: done ? 'var(--c-surface)' : 'var(--c-card)',
                borderColor: done ? 'var(--c-correct, #4ade80)' : 'var(--c-accent)',
              }}
            >
              <span style={{ fontSize: 36 }}>{THEME_ICONS[puzzle.theme] ?? '📝'}</span>
              <div className="flex-1">
                <p className="font-bold text-app text-base">{puzzle.title}</p>
                <p className="text-muted text-xs mt-0.5">{puzzle.theme} · {puzzle.words.length} words · {puzzle.difficulty}</p>
              </div>
              {done
                ? <CheckCircle size={22} className="text-green-400 shrink-0" />
                : <div className="w-6 h-6 rounded-full shrink-0" style={{ background: 'var(--c-accent)' }} />
              }
            </motion.button>
          );
        })}

        {puzzles.length === 0 && (
          <div className="text-center text-muted py-12">
            <Lock size={40} className="mx-auto mb-3 opacity-40" />
            <p>No puzzles yet for your age group. Check back soon! 🌱</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
