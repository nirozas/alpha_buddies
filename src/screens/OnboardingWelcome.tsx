import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import Mascot from '../components/Mascot';

export default function OnboardingWelcome() {
  const { player, setScreen } = useStore();

  useEffect(() => {
    const t = setTimeout(() => setScreen('dashboard'), 3000);
    return () => clearTimeout(t);
  }, [setScreen]);

  if (!player) return null;

  return (
    <div className="bg-app min-h-dvh flex flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ duration: 0.7, ease: 'backOut' }}
      >
        <Mascot state="celebrating" size={110} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 180 }}
        className="font-head text-app text-4xl font-black"
        style={{ fontFamily: 'var(--font-head)' }}
      >
        Welcome, {player.name}! 🎉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-muted text-xl"
      >
        I&apos;m <strong style={{ color: 'var(--c-accent)' }}>Lexie the Owl</strong>, your puzzle buddy!
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-muted"
      >
        Let&apos;s learn amazing words together ✨
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="w-32 h-1.5 rounded-full"
        style={{ background: 'var(--c-accent)' }}
      />
    </div>
  );
}
