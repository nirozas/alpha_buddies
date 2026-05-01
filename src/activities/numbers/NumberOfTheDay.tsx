import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { NUMBERS_DATA } from '../../constants/numbers';
import { BackButton, CelebrationScreen, FunFactCard, AudioButton } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

export function NumberOfTheDay() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity, markNumberComplete } = useStore();
  const nd = NUMBERS_DATA.find(n => n.digit === Number(number))!;

  const [visibleObjects, setVisibleObjects] = useState<number[]>([]);
  const [taps, setTaps] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [numberBounce, setNumberBounce] = useState(false);

  const handleNumberTap = () => {
    setNumberBounce(true);
    setTimeout(() => setNumberBounce(false), 500);
    // Reveal objects one by one
    if (visibleObjects.length < nd.objects.length) {
      setVisibleObjects(v => [...v, v.length]);
    }
    const newTaps = taps + 1;
    setTaps(newTaps);
    if (newTaps >= Math.max(3, nd.digit + 1) && !showCelebration) {
      const key = `${nd.digit}-number-of-the-day`;
      awardStars(key, 3);
      incrementActivity(key);
      markNumberComplete(nd.digit);
      setTimeout(() => setShowCelebration(true), 400);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-8" style={{ background: nd.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={nd.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: nd.color }}>Number of the Day</h2>
        <AudioButton onClick={() => {}} color={nd.color} />
      </div>

      <BuddyBear mood="excited" size={100}
        speech={`This is the number ${nd.digit}! That's "${nd.word}"! Tap to count! 🔢`}
      />

      {/* Giant number */}
      <motion.button
        onClick={handleNumberTap}
        animate={numberBounce ? { scale: [1, 1.3, 0.9, 1.1, 1], rotate: [0, -8, 8, -4, 0] } : { y: [0, -8, 0] }}
        transition={numberBounce ? { duration: 0.5 } : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        className="mt-2"
      >
        <div className="rounded-3xl flex flex-col items-center justify-center shadow-2xl"
          style={{ width: 180, height: 180, background: nd.color }}>
          <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '7rem', color: 'white', lineHeight: 1 }}>
            {nd.digit}
          </span>
        </div>
        <p style={{ fontFamily: 'Nunito', fontWeight: 700, color: nd.color, marginTop: 6 }}>
          {nd.word} — Tap me!
        </p>
      </motion.button>

      {/* Object reveal */}
      {nd.objects.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center px-6 max-w-xs">
          <AnimatePresence>
            {nd.objects.slice(0, Math.max(visibleObjects.length, 1)).map((obj, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: i * 0.08 }}
                style={{ fontSize: '2.5rem', lineHeight: 1 }}
              >{obj}</motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Fun fact */}
      {showFact && (
        <div className="p-4 w-full max-w-sm mt-4">
          <FunFactCard fact={nd.funFact} emoji={nd.emoji} onClose={() => navigate(-1)} />
        </div>
      )}

      <CelebrationScreen active={showCelebration} stars={3}
        message={`You know number ${nd.digit}! 🎉`}
        onContinue={() => { setShowCelebration(false); setShowFact(true); }}
      />
    </div>
  );
}
