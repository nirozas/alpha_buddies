import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import Mascot from '../components/Mascot';

export default function OnboardingName() {
  const { setScreen } = useStore();
  const [name, setName] = useState('');
  const [mascotState, setMascotState] = useState<'idle'|'happy'>('idle');

  const handleInput = (v: string) => {
    setName(v);
    setMascotState(v.length > 0 ? 'happy' : 'idle');
  };

  const next = () => {
    if (name.trim().length < 1) return;
    sessionStorage.setItem('pending-name', name.trim());
    setScreen('onboarding-age');
  };

  return (
    <div className="bg-app min-h-dvh flex flex-col items-center justify-center gap-8 px-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220 }}>
        <Mascot state={mascotState} size={90} label={mascotState === 'happy' ? `Hi, ${name}! 👋` : 'What is your name?'} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-xs"
      >
        <h1 className="font-head text-app text-3xl font-black text-center mb-6" style={{ fontFamily: 'var(--font-head)' }}>
          Who are you? 🌟
        </h1>

        <input
          type="text"
          value={name}
          onChange={e => handleInput(e.target.value)}
          placeholder="Type your name..."
          maxLength={20}
          className="w-full text-center text-2xl font-bold rounded-theme px-5 py-4 outline-none border-2 transition-all"
          style={{
            background: 'var(--c-surface)', color: 'var(--c-text)',
            borderColor: name ? 'var(--c-accent)' : 'var(--c-card)',
            fontFamily: 'var(--font-head)',
          }}
          onKeyDown={e => e.key === 'Enter' && next()}
          autoFocus
        />

        <motion.button
          onClick={next}
          disabled={!name.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-5 w-full flex items-center justify-center gap-2 py-4 rounded-theme font-bold text-lg text-white transition-opacity disabled:opacity-30"
          style={{ background: 'linear-gradient(135deg, var(--c-accent), var(--c-accent2))', fontFamily: 'var(--font-head)' }}
        >
          Next <ArrowRight size={20} />
        </motion.button>
      </motion.div>
    </div>
  );
}
