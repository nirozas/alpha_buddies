import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactConfetti from 'react-confetti';
import { Illustration } from './Illustration';
import { useStore } from '../store';

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
  const timerRef = useRef<any>(null);
  useEffect(() => {
    if (active) {
      timerRef.current = setTimeout(() => { }, duration) as any;
    }
    return () => clearTimeout(timerRef.current as any);
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
interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  showPercent?: boolean;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  color = '#6C3CE1',
  showPercent = true,
  label,
  className = '',
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;

  return (
    <div className={`w-full flex items-center gap-2 ${className}`}>
      {label && (
        <span className="text-xs font-black text-slate-700 shrink-0 select-none">
          {label}
        </span>
      )}
      <div className="flex-1 h-3.5 sm:h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border-2 border-slate-200/90 shadow-inner relative">
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        >
          {/* Inner glossy highlight line */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/40 rounded-t-full" />
        </motion.div>
      </div>

      {showPercent && (
        <div
          className="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-black shrink-0 shadow-xs border flex items-center gap-1 select-none"
          style={{
            backgroundColor: pct === 100 ? '#FEF08A' : '#F8FAFC',
            color: pct === 100 ? '#854D0E' : '#334155',
            borderColor: pct === 100 ? '#FACC15' : '#CBD5E1',
          }}
        >
          {pct === 100 && <span className="text-[10px]">⭐</span>}
          <span>{pct}%</span>
        </div>
      )}
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
interface CelebrationProps { 
  active: boolean; 
  stars?: 1 | 2 | 3; 
  message?: string; 
  onContinue?: () => void; 
  onMenu?: () => void;
  children?: React.ReactNode; 
}
export function CelebrationScreen({ active, stars = 3, message = 'Amazing job!', onContinue, onMenu, children }: CelebrationProps) {
  const navigate = useNavigate();

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
      return;
    }

    const parts = window.location.pathname.split('/').filter(Boolean);
    const isNumbers = window.location.pathname.includes('/numbers');

    // Go back to the letters/numbers page of the game that was playing
    if (parts.length >= 4) {
      // E.g. /letters/activity/letter-match/A -> /letters/activity/letter-match
      navigate(`/${parts[0]}/${parts[1]}/${parts[2]}`);
    } else if (parts.length === 3) {
      // E.g. /letters/activity/memory-letters
      navigate(`/${parts[0]}/${parts[1]}/${parts[2]}`);
    } else {
      navigate(isNumbers ? '/numbers' : '/letters');
    }
  };

  const handleMenu = () => {
    if (onMenu) {
      onMenu();
      return;
    }
    const isNumbers = window.location.pathname.includes('/numbers');
    // All activities goes to the games page
    navigate(isNumbers ? '/numbers' : '/letters');
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-y-auto p-4 select-none"
          style={{ background: 'linear-gradient(135deg, rgba(108,60,225,0.94), rgba(13,158,117,0.94))' }}
        >
          <ConfettiCannon active={active} />
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="flex flex-col items-center gap-4 sm:gap-5 p-4 sm:p-8 my-auto min-h-min text-center max-w-lg w-full"
          >
            <motion.div
              animate={{ rotate: [0, 20, -20, 10, 0], scale: [1, 1.2, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Illustration emoji="🥳" size={88} />
            </motion.div>
            <p className="text-3xl sm:text-4xl font-black text-white text-center drop-shadow-lg leading-tight px-2" style={{ fontFamily: 'Nunito' }}>
              {message}
            </p>
            <StarRating stars={stars} size={48} />

            {children && (
              <div className="mt-2 scale-95 origin-top z-50 drop-shadow-2xl w-full">
                {children}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 w-full z-50">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={handleContinue}
                className="btn-primary shadow-2xl font-black rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                style={{ 
                  background: 'white', 
                  color: '#6C3CE1', 
                  fontSize: '1.25rem', 
                  padding: '0.875rem 2.5rem',
                  fontFamily: 'Nunito'
                }}
              >
                Keep Going! 🚀
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={handleMenu}
                className="font-bold text-white/95 hover:text-white underline text-base cursor-pointer px-4 py-2 hover:opacity-100 transition-opacity"
                style={{ fontFamily: 'Nunito' }}
              >
                All Activities 🌲
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── ActivityCard ────────────────────────────────────────────────────────────
interface ActivityCardProps {
  icon: string; name: string; description: string;
  locked?: boolean; onClick?: () => void;
  smaller?: boolean;
}
export function ActivityCard({ icon, name, description, locked, onClick, smaller }: ActivityCardProps) {
  return (
    <motion.button
      whileHover={locked ? {} : { scale: 1.04, y: -4 }}
      whileTap={locked ? {} : { scale: 0.97 }}
      onClick={locked ? undefined : onClick}
      className={`${smaller ? 'p-2' : 'p-4'} flex flex-col items-center justify-center gap-1 text-center cursor-pointer w-full shadow-lg`}
      style={{
        opacity: locked ? 0.5 : 1,
        cursor: locked ? 'not-allowed' : 'pointer',
        minHeight: smaller ? 100 : 140,
        background: 'rgba(240, 253, 244, 0.95)', // light green/earthy
        border: `${smaller ? '3px' : '4px'} solid #166534`, // deep forest green
        borderRadius: smaller ? '20px 6px 20px 6px' : '32px 8px 32px 8px', // Leaf shape
        backdropFilter: 'blur(4px)',
      }}
    >
      <span className={`${smaller ? 'text-2xl' : 'text-4xl'} drop-shadow-md`}>{locked ? '🔒' : icon}</span>
      <p className={`font-bold ${smaller ? 'text-sm' : 'text-base'} leading-tight text-emerald-950`} style={{ fontFamily: 'Nunito' }}>{name}</p>
      <p className={`${smaller ? 'text-[10px]' : 'text-xs'} text-emerald-800 font-bold`} style={{ fontFamily: 'Nunito' }}>{description}</p>
    </motion.button>
  );
}

// ── BackButton ──────────────────────────────────────────────────────────────
interface BackButtonProps { onClick?: () => void; color?: string; fallback?: string }
export function BackButton({ onClick, color = '#6C3CE1', fallback }: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (fallback) {
      navigate(fallback);
      return;
    }

    // Default intelligent back navigation:
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    // e.g. ['letters', 'activity', 'learn-my-letters', 'A']
    if (parts.length >= 4) {
      // Go back to the letter selection page for this activity
      navigate(`/${parts[0]}/${parts[1]}/${parts[2]}`);
    } else if (parts.length >= 2) {
      // Go back to the games page: /letters or /numbers
      navigate(`/${parts[0]}`);
    } else {
      navigate('/');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleBack}
      className="flex items-center justify-center rounded-full shadow-lg cursor-pointer"
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

// ── StickerRewardModal ───────────────────────────────────────────────────────
export function StickerRewardModal() {
  const { newStickerUnlocked, clearNewSticker } = useStore();
  const navigate = useNavigate();

  if (!newStickerUnlocked) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-black/60 backdrop-blur-sm p-4 select-none font-nunito"
      >
        <motion.div
          initial={{ scale: 0.5, y: 50, rotate: -5 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="bg-gradient-to-b from-amber-50 to-orange-100 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border-4 border-amber-300 relative overflow-hidden"
        >
          <div className="text-xs font-black tracking-widest uppercase text-amber-600 bg-amber-200/60 rounded-full px-3 py-1 inline-block mb-3">
            🎉 New Sticker Unlocked!
          </div>

          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-32 h-32 mx-auto my-2 rounded-full bg-white shadow-2xl border-4 border-amber-400 flex items-center justify-center overflow-hidden p-1.5"
          >
            {newStickerUnlocked.imageUrl ? (
              <img
                src={newStickerUnlocked.imageUrl}
                alt={newStickerUnlocked.title}
                className="w-full h-full object-contain rounded-full drop-shadow-md"
              />
            ) : (
              <span className="text-6xl">{newStickerUnlocked.icon}</span>
            )}
          </motion.div>

          <h3 className="text-2xl font-black text-amber-950 mt-3">{newStickerUnlocked.title}</h3>
          <p className="text-amber-800 text-sm font-bold mt-1 mb-5">{newStickerUnlocked.description}</p>

          <div className="flex flex-col gap-2">
            <button
              onClick={clearNewSticker}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-base cursor-pointer"
            >
              Collect & Keep Playing 🚀
            </button>
            <button
              onClick={() => {
                clearNewSticker();
                navigate('/progress');
              }}
              className="w-full py-2 text-amber-900/80 hover:text-amber-950 font-bold text-sm cursor-pointer underline"
            >
              View in Sticker Album 🎨
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
