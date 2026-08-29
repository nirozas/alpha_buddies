import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { NUMBERS_DATA } from '../../constants/numbers';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

export function BuildTower() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const nd = NUMBERS_DATA.find(n => n.digit === Number(number))!;

  const target = Math.max(1, nd.digit);
  const [blocks, setBlocks] = useState<number[]>([]);
  const [wobble, setWobble] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#06B6D4'];

  const addBlock = () => {
    if (blocks.length >= target + 2) return;
    if (blocks.length >= target) {
      setWobble(true);
      setTimeout(() => { setWobble(false); setBlocks([]); }, 1200);
      return;
    }
    const newBlocks = [...blocks, blocks.length];
    setBlocks(newBlocks);
    if (newBlocks.length === target) {
      awardStars(`${nd.digit}-build-tower`, 3);
      incrementActivity(`${nd.digit}-build-tower`);
      setTimeout(() => setShowCelebration(true), 600);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-8" style={{ background: nd.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={nd.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: nd.color }}>Build the Tower</h2>
        <div style={{ width: 56 }} />
      </div>

      <BuddyBear mood={blocks.length === target ? 'celebrating' : wobble ? 'thinking' : 'happy'} size={90}
        speech={wobble ? `Oops! Too tall! The tower fell! Try again! 😄` :
          blocks.length === target ? `Amazing! A tower of ${target}! 🏗️` :
          `Build a tower with exactly ${target} blocks! Tap to add! 🧱`}
      />

      {/* Target */}
      <div className="flex items-center gap-2 my-2 px-4 py-2 rounded-full shadow"
        style={{ background: nd.color, fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>
        Build <span style={{ fontSize: '1.5rem', margin: '0 6px' }}>{target}</span> blocks high
      </div>

      {/* Tower display */}
      <div className="flex-1 flex flex-col items-center justify-end mt-2" style={{ minHeight: 200 }}>
        <motion.div
          animate={wobble ? { rotate: [0, -10, 12, -8, 5, 0], x: [0, -10, 12, -8, 0] } :
            blocks.length === target ? { scale: [1, 1.04, 1] } : {}}
          transition={wobble ? { duration: 0.9 } : {}}
          className="flex flex-col-reverse gap-1 items-center"
        >
          <AnimatePresence>
            {blocks.map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -40, opacity: 0, scale: 0.6 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                className="rounded-xl flex items-center justify-center shadow-md"
                style={{ width: 120, height: 44, background: COLORS[i % COLORS.length], border: '3px solid rgba(255,255,255,0.5)' }}
              >
                <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.3rem', color: 'white' }}>
                  {i + 1}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Ground */}
        <div style={{ width: 160, height: 10, background: nd.color + '40', borderRadius: 4, marginTop: 4 }} />
      </div>

      {/* Progress */}
      <p className="mt-3" style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.4rem', color: nd.color }}>
        {blocks.length} / {target} blocks
      </p>

      {/* Add block button */}
      <motion.button
        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }}
        onClick={addBlock}
        className="mt-4 rounded-3xl shadow-xl flex items-center gap-3 px-8 py-4"
        style={{ background: nd.color, fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.4rem', color: 'white', border: 'none', cursor: 'pointer', minHeight: 72 }}
      >
        🧱 Add a block!
      </motion.button>

      <motion.button whileTap={{ scale: 0.9 }} onClick={() => setBlocks([])}
        className="mt-3 rounded-full px-5 py-2"
        style={{ background: 'white', border: `2px solid ${nd.color}`, color: nd.color, fontFamily: 'Nunito', fontWeight: 700 }}>
        Reset 🔄
      </motion.button>

      {showFact && (
        <div className="p-4 w-full max-w-sm mt-4">
          <FunFactCard fact={nd.funFact} emoji={nd.emoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={3} message={`Tower of ${target}! Amazing! 🏗️`}
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
