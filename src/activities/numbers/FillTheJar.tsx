import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { NUMBERS_DATA } from '../../constants/numbers';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

export function FillTheJar() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const nd = NUMBERS_DATA.find(n => n.digit === Number(number))!;

  const target = Math.max(1, nd.digit);
  const [count, setCount] = useState(0);
  const [overflow, setOverflow] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [items, setItems] = useState<number[]>([]);

  const handleAdd = () => {
    if (count >= target + 2) return;
    if (count >= target) {
      setOverflow(true);
      setTimeout(() => setOverflow(false), 800);
      return;
    }
    const newCount = count + 1;
    setCount(newCount);
    setItems(i => [...i, Date.now()]);
    if (newCount === target) {
      awardStars(`${nd.digit}-fill-the-jar`, 3);
      incrementActivity(`${nd.digit}-fill-the-jar`);
      setTimeout(() => setShowCelebration(true), 600);
    }
  };

  const fillPct = Math.min(100, (count / target) * 100);
  const cookieEmoji = nd.objects[0] || '🍪';

  return (
    <div className="min-h-dvh flex flex-col items-center pb-8" style={{ background: nd.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={nd.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: nd.color }}>Fill the Jar</h2>
        <div style={{ width: 56 }} />
      </div>

      <BuddyBear mood={count === target ? 'celebrating' : overflow ? 'thinking' : 'happy'} size={90}
        speech={overflow ? `Oops! The jar is full! You need exactly ${target}! 🫙` :
          count === target ? 'Perfect! The jar is full! 🎉' :
          `Put exactly ${target} ${cookieEmoji} into the jar! Tap to add one!`}
      />

      {/* Target */}
      <div className="flex items-center gap-2 my-2 px-4 py-2 rounded-full shadow"
        style={{ background: nd.color, fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>
        Fill with <span style={{ fontSize: '1.5rem', margin: '0 4px' }}>{target}</span> {cookieEmoji}
      </div>

      {/* Jar */}
      <motion.div
        animate={overflow ? { x: [-6, 6, -4, 4, 0] } : count === target ? { scale: [1, 1.05, 1] } : {}}
        className="relative mt-4"
        style={{ width: 150, height: 200 }}
      >
        {/* Jar outline */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: '12px 12px 24px 24px', border: `4px solid ${nd.color}`, background: 'rgba(255,255,255,0.6)', overflow: 'hidden' }}>
          {/* Fill level */}
          <motion.div
            animate={{ height: `${fillPct}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: nd.color + '60', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-end', gap: 2, padding: 6 }}
          >
            <AnimatePresence>
              {items.map((id) => (
                <motion.span key={id} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: '1.4rem' }}>
                  {cookieEmoji}
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
        {/* Jar lid */}
        <div style={{ position: 'absolute', top: -12, left: '10%', right: '10%', height: 20, borderRadius: 8, background: nd.color, zIndex: 1 }} />
        {/* Overflow spill */}
        <AnimatePresence>
          {overflow && (
            <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: 20 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', bottom: -30, left: '10%', fontSize: '1.5rem' }}>
              {cookieEmoji}{cookieEmoji}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Counter */}
      <p className="mt-5" style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.5rem', color: nd.color }}>
        {count} / {target}
      </p>

      {/* Big add button */}
      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
        onClick={handleAdd}
        className="mt-5 rounded-3xl shadow-xl flex items-center gap-3 px-8 py-4"
        style={{ background: nd.color, fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.4rem', color: 'white', border: 'none', cursor: 'pointer', minHeight: 72 }}
      >
        <span style={{ fontSize: '2.2rem' }}>{cookieEmoji}</span>
        Add one!
      </motion.button>

      {/* Reset */}
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setCount(0); setItems([]); }}
        className="mt-3 rounded-full px-5 py-2"
        style={{ background: 'white', border: `2px solid ${nd.color}`, color: nd.color, fontFamily: 'Nunito', fontWeight: 700 }}>
        Reset 🔄
      </motion.button>

      {showFact && (
        <div className="p-4 w-full max-w-sm mt-4">
          <FunFactCard fact={nd.funFact} emoji={nd.emoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={3} message="Perfect fill! 🫙🎉"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
