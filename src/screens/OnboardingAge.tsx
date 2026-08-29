import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import Mascot from '../components/Mascot';

import type { AgeGroup } from '../types';

const AGES: AgeGroup[] = ['4-5', '6-8', '9-11', '12-15', '15-18', '18+'];
const AGE_EMOJIS: Record<AgeGroup, string> = {
  '4-5':'🌈', '6-8':'🌿', '9-11':'🧭', '12-15':'🚀', '15-18':'📚', '18+':'🎓'
};

export default function OnboardingAge() {
  const { setPlayer } = useStore();
  const [selected, setSelected] = useState<AgeGroup | null>(null);
  const name = sessionStorage.getItem('pending-name') ?? 'Friend';

  const confirm = () => {
    if (!selected) return;
    setPlayer(name, selected);
  };

  return (
    <div className="bg-app min-h-dvh flex flex-col items-center justify-center gap-8 px-6 py-10">
      <Mascot state={selected ? 'happy' : 'thinking'} size={80}
        label={selected ? `Ages ${selected}? Great choice!` : 'How old are you?'} />

      <h1 className="font-head text-app text-3xl font-black text-center" style={{ fontFamily: 'var(--font-head)' }}>
        Pick your age 🎂
      </h1>

      <motion.div
        className="grid grid-cols-2 gap-3 w-full max-w-xs"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {AGES.map(age => (
          <motion.button
            key={age}
            variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setSelected(age)}
            className="flex flex-col items-center justify-center gap-1 py-4 rounded-2xl font-bold text-lg border-2 transition-all min-h-[80px]"
            style={{
              background: selected === age ? 'var(--c-accent)' : 'var(--c-surface)',
              borderColor: selected === age ? 'var(--c-accent)' : 'var(--c-card)',
              color: selected === age ? '#fff' : 'var(--c-text)',
            }}
          >
            <span style={{ fontSize: 28 }}>{AGE_EMOJIS[age]}</span>
            <span>{age}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.button
        onClick={confirm}
        disabled={!selected}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="w-full max-w-xs py-4 rounded-theme font-bold text-lg text-white disabled:opacity-30"
        style={{ background: 'linear-gradient(135deg, var(--c-accent), var(--c-accent2))', fontFamily: 'var(--font-head)' }}
      >
        Let&apos;s Go! 🎉
      </motion.button>
    </div>
  );
}
