import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter } from 'lucide-react';
import { useStore } from '../store/useStore';
import { allPuzzles, THEME_ICONS } from '../data';
import { CATEGORY_GRADIENTS } from '../config/themes';

export default function WordCollection() {
  const { player, setScreen } = useStore();
  const [filter, setFilter] = useState<string | null>(null);
  const [flipped, setFlipped] = useState<string | null>(null);
  if (!player) return null;

  const learnedWords = player.wordsLearned;
  const allCards = allPuzzles
    .flatMap(p => p.words.map(w => w.funFact))
    .filter(f => learnedWords.includes(f.word));

  const categories = [...new Set(allCards.map(c => c.category))];
  const displayed = filter ? allCards.filter(c => c.category === filter) : allCards;

  return (
    <div className="bg-app min-h-dvh flex flex-col px-4 py-8 gap-5 max-w-md mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => setScreen('dashboard')}
          className="p-2 rounded-xl" style={{ background: 'var(--c-surface)', color: 'var(--c-text)' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-head text-app text-2xl font-black" style={{ fontFamily: 'var(--font-head)' }}>
          My Word Collection 📚
        </h1>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--c-surface)' }}>
        <p className="text-muted text-xs font-semibold mb-2">
          {learnedWords.length} words collected!
        </p>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--c-card)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--c-accent), var(--c-accent2))' }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((learnedWords.length / 50) * 100, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(null)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2 flex items-center gap-1"
            style={{
              background: !filter ? 'var(--c-accent)' : 'var(--c-surface)',
              borderColor: !filter ? 'var(--c-accent)' : 'var(--c-card)',
              color: !filter ? '#fff' : 'var(--c-text)',
            }}
          >
            <Filter size={12} /> All
          </motion.button>
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat === filter ? null : cat)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2"
              style={{
                background: filter === cat ? 'var(--c-accent)' : 'var(--c-surface)',
                borderColor: filter === cat ? 'var(--c-accent)' : 'var(--c-card)',
                color: filter === cat ? '#fff' : 'var(--c-text)',
              }}
            >
              {THEME_ICONS[cat] ?? '📚'} {cat}
            </motion.button>
          ))}
        </div>
      )}

      {/* Cards grid */}
      {displayed.length === 0 ? (
        <div className="text-center text-muted py-16">
          <p className="text-5xl mb-4">📭</p>
          <p>Complete puzzles to collect word cards! 🌟</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {displayed.map(card => (
            <motion.div
              key={card.word}
              variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFlipped(flipped === card.word ? null : card.word)}
              style={{ perspective: 600 }}
            >
              <motion.div
                animate={{ rotateY: flipped === card.word ? 180 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ transformStyle: 'preserve-3d', position: 'relative', minHeight: 140 }}
              >
                {/* Front */}
                <div
                  className={`absolute inset-0 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 bg-gradient-to-br ${CATEGORY_GRADIENTS[card.category] ?? 'from-indigo-500 to-purple-700'}`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span style={{ fontSize: 36 }}>{card.emoji}</span>
                  <p className="text-white font-black text-base text-center">{card.word}</p>
                  <p className="text-white/60 text-xs text-center">{card.category}</p>
                </div>
                {/* Back */}
                <div
                  className={`absolute inset-0 rounded-2xl p-3 flex flex-col justify-center gap-2 bg-gradient-to-br ${CATEGORY_GRADIENTS[card.category] ?? 'from-indigo-500 to-purple-700'}`}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <p className="text-white text-xs font-semibold leading-snug">{card.funFact}</p>
                  <p className="text-white/60 text-xs leading-snug">💡 {card.didYouKnow.slice(0, 80)}…</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
