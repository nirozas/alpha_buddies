import { motion } from 'framer-motion';
import { Star, Flame, BookOpen, Play, Settings, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import Mascot from '../components/Mascot';
import { AGE_THEMES } from '../config/themes';

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-1 p-4 rounded-2xl"
      style={{ background: 'var(--c-surface)' }}
    >
      <div style={{ color: 'var(--c-accent)' }}>{icon}</div>
      <motion.span
        className="text-2xl font-black text-app"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 250, delay: 0.3 }}
      >
        {value}
      </motion.span>
      <span className="text-xs text-muted font-semibold uppercase tracking-wide">{label}</span>
    </motion.div>
  );
}

export default function Dashboard() {
  const { player, setScreen, resetPlayer } = useStore();
  if (!player) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const theme = AGE_THEMES[player.ageGroup] ?? AGE_THEMES['9-11'];

  return (
    <div className="bg-app min-h-dvh flex flex-col px-5 py-8 gap-6 max-w-md mx-auto relative">
      {/* Floating emojis */}
      {['⭐','✨','💫','🌟'].map((e, i) => (
        <motion.span key={i} className="absolute text-2xl opacity-20 select-none pointer-events-none"
          style={{ top: `${10 + i * 20}%`, right: `${5 + i * 8}%` }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.5 }}
        >{e}</motion.span>
      ))}

      <div className="flex items-center justify-between">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted text-sm font-semibold">
            {greeting},
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-head text-app text-3xl font-black"
            style={{ fontFamily: 'var(--font-head)' }}
          >
            {player.name}! {theme.emoji}
          </motion.h1>
        </div>
        <Mascot state="idle" size={60} />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="inline-flex self-start items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold"
        style={{ background: 'linear-gradient(135deg, var(--c-accent), var(--c-accent2))' }}
      >
        {theme.emoji} {theme.label} Explorer
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<Star size={20} />} label="Stars" value={player.starsTotal} />
        <StatCard icon={<BookOpen size={20} />} label="Words" value={player.wordsLearned.length} />
        <StatCard icon={<Flame size={20} />} label="Streak" value={`${player.streakDays}d`} />
      </div>

      {/* Play Now */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setScreen('puzzle-select')}
        className="flex items-center justify-center gap-3 w-full py-5 rounded-theme text-white text-xl font-black shadow-xl"
        style={{ background: 'linear-gradient(135deg, var(--c-accent), var(--c-accent2))', fontFamily: 'var(--font-head)' }}
        animate={{ boxShadow: ['0 0 20px var(--c-accent)55', '0 0 40px var(--c-accent2)55', '0 0 20px var(--c-accent)55'] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <Play size={26} fill="white" /> Play Now!
      </motion.button>

      {/* Secondary actions */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setScreen('word-collection')}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm border-2"
          style={{ background: 'var(--c-surface)', borderColor: 'var(--c-card)', color: 'var(--c-text)' }}
        >
          <BookOpen size={18} style={{ color: 'var(--c-accent)' }} /> My Words
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setScreen('settings')}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm border-2"
          style={{ background: 'var(--c-surface)', borderColor: 'var(--c-card)', color: 'var(--c-text)' }}
        >
          <Settings size={18} style={{ color: 'var(--c-accent2)' }} /> Settings
        </motion.button>
      </div>

      <button
        onClick={resetPlayer}
        className="flex items-center gap-1 text-xs text-muted self-center hover:text-app transition-colors"
      >
        <RefreshCw size={13} /> Change player
      </button>
    </div>
  );
}
