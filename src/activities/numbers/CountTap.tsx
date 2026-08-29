import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { NUMBERS_DATA } from '../../constants/numbers';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

export function CountTap() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const nd = NUMBERS_DATA.find(n => n.digit === Number(number))!;

  const [tapped, setTapped] = useState<number[]>([]);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [shake, setShake] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  // Generate a random set of 2-9 objects
  const [count] = useState(() => nd.digit > 0 ? nd.digit : 3);
  const [objects] = useState(() => {
    const base = nd.objects.length > 0 ? nd.objects : ['⭐', '🌸', '🍎', '🎈', '🦋', '🌟', '🍄', '🐢', '🌺'];
    const pool = count <= base.length ? base.slice(0, count) :
      Array.from({ length: count }, (_, i) => base[i % base.length]);
    return pool;
  });

  const answerOptions = [
    Math.max(0, count - 1),
    count,
    Math.min(9, count + 1),
  ].sort(() => Math.random() - 0.5);

  const handleTapObject = (i: number) => {
    if (tapped.includes(i) || answered) return;
    setTapped(t => [...t, i]);
  };

  const handleAnswer = (ans: number) => {
    if (answered) return;
    setSelectedAnswer(ans);
    setAnswered(true);
    if (ans === count) {
      const stars: 1|2|3 = mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1;
      awardStars(`${nd.digit}-count-tap`, stars);
      incrementActivity(`${nd.digit}-count-tap`);
      setTimeout(() => setShowCelebration(true), 500);
    } else {
      setMistakes(m => m + 1);
      setShake(true);
      setTimeout(() => { setShake(false); setAnswered(false); setSelectedAnswer(null); }, 800);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-8" style={{ background: nd.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={nd.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: nd.color }}>Count &amp; Tap</h2>
        <div style={{ width: 56 }} />
      </div>

      <BuddyBear mood="thinking" size={90}
        speech={`Tap each ${objects[0]} to count them, then pick the right number! 👆`}
      />

      {/* Counter badge */}
      <motion.div
        animate={{ scale: tapped.length > 0 ? [1, 1.2, 1] : 1 }}
        className="my-3 rounded-2xl px-6 py-2 shadow-lg"
        style={{ background: nd.color }}
      >
        <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '2rem', color: 'white' }}>
          {tapped.length} / {count}
        </span>
      </motion.div>

      {/* Tappable objects grid */}
      <motion.div
        animate={shake ? { x: [-8, 8, -5, 5, 0] } : {}}
        className="flex flex-wrap gap-3 justify-center px-6 max-w-sm"
      >
        {objects.map((obj, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.85 }}
            animate={tapped.includes(i) ? { scale: [1, 1.4, 1.2], rotate: [0, 10, -10, 0] } : { y: [0, -4, 0] }}
            transition={tapped.includes(i) ? { duration: 0.4 } : { repeat: Infinity, duration: 2 + i * 0.2, ease: 'easeInOut' }}
            onClick={() => handleTapObject(i)}
            className="rounded-2xl flex items-center justify-center"
            style={{
              width: 72, height: 72, fontSize: '2.5rem',
              background: tapped.includes(i) ? nd.color + '30' : 'white',
              border: `3px solid ${tapped.includes(i) ? nd.color : '#E7E5E4'}`,
              boxShadow: tapped.includes(i) ? `0 0 0 4px ${nd.color}40` : '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            {obj}
          </motion.button>
        ))}
      </motion.div>

      {/* Answer buttons */}
      <p className="mt-5 text-center" style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '1.1rem', color: '#1C1917' }}>
        How many {objects[0]}?
      </p>
      <div className="flex gap-4 mt-3">
        {answerOptions.map(ans => (
          <motion.button
            key={ans}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(ans)}
            className="rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              width: 80, height: 80,
              background: selectedAnswer === ans && ans === count ? nd.color : selectedAnswer === ans ? '#FEF2F2' : 'white',
              border: `4px solid ${selectedAnswer === ans && ans === count ? nd.color : selectedAnswer === ans ? '#EF4444' : nd.color + '60'}`,
            }}
          >
            <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '2.2rem', color: selectedAnswer === ans && ans === count ? 'white' : nd.color }}>
              {ans}
            </span>
          </motion.button>
        ))}
      </div>

      {showFact && (
        <div className="p-4 w-full max-w-sm mt-4">
          <FunFactCard fact={nd.funFact} emoji={nd.emoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1}
        message={`Great counting! ${nd.digit} is right! 🎉`}
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
