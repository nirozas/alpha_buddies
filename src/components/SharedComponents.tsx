import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import ReactConfetti from 'react-confetti';
import { Illustration } from './Illustration';

// ── StarRating ──────────────────────────────────────────────────────────────
interface StarRatingProps { stars: 0 | 1 | 2 | 3; size?: number }
export function StarRating({ stars, size = 36 }: StarRatingProps) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map((n) => (
        <motion.span
          key={n}
          initial={{ scale: 0, opacity: 0 }}
          animate={n <= stars ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0.3 }}
          transition={{ delay: n * 0.15, type: 'spring', stiffness: 400, damping: 15 }}
          style={{ fontSize: size }}
        >
          {n <= stars ? <Illustration emoji="⭐" size={size} /> : <span style={{ opacity: 0.3 }}><Illustration emoji="⭐" size={size} /></span>}
        </motion.span>
      ))}
    </div>
  );
}

// ── ConfettiCannon ──────────────────────────────────────────────────────────
interface ConfettiProps { active: boolean; duration?: number }
export function ConfettiCannon({ active, duration = 3000 }: ConfettiProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (active) {
      timerRef.current = setTimeout(() => { }, duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [active, duration]);

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={250}
            colors={['#6C3CE1', '#F97316', '#22C55E', '#FBBF24', '#EC4899', '#0D9E75']}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

// ── ProgressBar ─────────────────────────────────────────────────────────────
interface ProgressBarProps { value: number; max: number; color?: string }
export function ProgressBar({ value, max, color = '#6C3CE1' }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      />
    </div>
  );
}

// ── FunFactCard ─────────────────────────────────────────────────────────────
interface FunFactProps { fact: string; emoji?: string; onClose?: () => void }
export function FunFactCard({ fact, emoji = '🤩', onClose }: FunFactProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card p-5 flex flex-col items-center gap-3 text-center max-w-sm mx-auto"
      style={{ background: 'linear-gradient(135deg, #FFF7ED, #EDE9FB)' }}
    >
      <Illustration emoji={emoji} size={64} />
      <p className="text-xl font-bold" style={{ color: '#1C1917', fontFamily: 'Nunito' }}>
        Did you know?
      </p>
      <p className="text-lg" style={{ color: '#44403C', fontFamily: 'Nunito' }}>{fact}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="btn-primary mt-2"
          style={{ background: '#6C3CE1', color: 'white', padding: '0.5rem 1.5rem', fontSize: '1rem' }}
        >
          Awesome! 🎉
        </button>
      )}
    </motion.div>
  );
}

// ── CelebrationScreen ───────────────────────────────────────────────────────
interface CelebrationProps { active: boolean; stars?: 1 | 2 | 3; message?: string; onContinue?: () => void; children?: React.ReactNode; }
export function CelebrationScreen({ active, stars = 3, message = 'Amazing job!', onContinue, children }: CelebrationProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex flex-col items-center justify-center z-40 overflow-y-auto"
          style={{ background: 'linear-gradient(135deg, rgba(108,60,225,0.92), rgba(13,158,117,0.92))' }}
        >
          <ConfettiCannon active={active} />
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="flex flex-col items-center gap-6 p-8 my-auto min-h-min"
          >
            <motion.div
              animate={{ rotate: [0, 20, -20, 10, 0], scale: [1, 1.2, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Illustration emoji="🥳" size={100} />
            </motion.div>
            <p className="text-4xl font-black text-white text-center drop-shadow-lg">{message}</p>
            <StarRating stars={stars} size={48} />

            {children && (
              <div className="mt-4 scale-95 origin-top z-50 drop-shadow-2xl">
                {children}
              </div>
            )}

            {onContinue && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={onContinue}
                className="btn-primary mt-4 z-50"
                style={{ background: 'white', color: '#6C3CE1', fontSize: '1.25rem', padding: '0.875rem 2.5rem' }}
              >
                Keep Going! 🚀
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── ActivityCard ────────────────────────────────────────────────────────────
interface ActivityCardProps {
  icon: string; name: string; description: string;
  stars?: 0 | 1 | 2 | 3; locked?: boolean; onClick?: () => void;
}
export function ActivityCard({ icon, name, description, stars = 0, locked, onClick }: ActivityCardProps) {
  return (
    <motion.button
      whileHover={locked ? {} : { scale: 1.04, y: -4 }}
      whileTap={locked ? {} : { scale: 0.97 }}
      onClick={locked ? undefined : onClick}
      className="p-4 flex flex-col items-center justify-center gap-2 text-center cursor-pointer w-full shadow-lg"
      style={{
        opacity: locked ? 0.5 : 1,
        cursor: locked ? 'not-allowed' : 'pointer',
        minHeight: 140,
        background: 'rgba(240, 253, 244, 0.95)', // light green/earthy
        border: '4px solid #166534', // deep forest green
        borderRadius: '32px 8px 32px 8px', // Leaf shape
        backdropFilter: 'blur(4px)',
      }}
    >
      <span className="text-4xl drop-shadow-md">{locked ? '🔒' : icon}</span>
      <p className="font-bold text-base leading-tight text-emerald-950" style={{ fontFamily: 'Nunito' }}>{name}</p>
      <p className="text-xs text-emerald-800 font-bold" style={{ fontFamily: 'Nunito' }}>{description}</p>
      {stars > 0 && <StarRating stars={stars as 1 | 2 | 3} size={16} />}
    </motion.button>
  );
}

// ── BackButton ──────────────────────────────────────────────────────────────
interface BackButtonProps { onClick: () => void; color?: string }
export function BackButton({ onClick, color = '#6C3CE1' }: BackButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="flex items-center justify-center rounded-full shadow-lg"
      style={{ width: 56, height: 56, background: 'white', border: `3px solid ${color}`, flexShrink: 0 }}
      aria-label="Go back"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  );
}

// ── AudioButton ─────────────────────────────────────────────────────────────
interface AudioButtonProps { onClick: () => void; color?: string; playing?: boolean }
export function AudioButton({ onClick, color = '#6C3CE1', playing }: AudioButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={playing ? { scale: [1, 1.1, 1] } : {}}
      transition={playing ? { repeat: Infinity, duration: 0.8 } : {}}
      onClick={onClick}
      className="flex items-center justify-center rounded-full shadow-md"
      style={{ width: 56, height: 56, background: color, flexShrink: 0 }}
      aria-label="Play audio"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="white" />
        {playing ? (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="white" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    </motion.button>
  );
}
