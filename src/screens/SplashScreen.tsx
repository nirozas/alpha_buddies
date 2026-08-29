import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import Mascot from '../components/Mascot';

export default function SplashScreen() {
  const { setScreen, player } = useStore();

  useEffect(() => {
    const t = setTimeout(() => {
      setScreen(player ? 'dashboard' : 'onboarding-name');
    }, 2200);
    return () => clearTimeout(t);
  }, [player, setScreen]);

  return (
    <div className="bg-app min-h-dvh flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      {/* Floating background orbs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: 80 + i * 30, height: 80 + i * 30,
            background: i % 2 === 0 ? 'var(--c-accent)' : 'var(--c-accent2)',
            left: `${10 + i * 11}%`, top: `${5 + i * 11}%`,
          }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="relative z-10"
      >
        <Mascot state="celebrating" size={100} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="font-head text-app text-5xl font-black text-center relative z-10"
        style={{ fontFamily: 'var(--font-head)' }}
      >
        My Crossword
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-muted text-lg text-center relative z-10"
      >
        Learn words. Discover facts. Have fun! 🌟
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="w-48 h-1.5 rounded-full relative z-10"
        style={{ background: 'var(--c-accent)' }}
      />
    </div>
  );
}
