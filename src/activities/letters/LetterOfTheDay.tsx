import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BuddyBear } from '../../components/BuddyBear';
import { BackButton, CelebrationScreen, FunFactCard, AudioButton } from '../../components/SharedComponents';
import { useStore } from '../../store';

export function LetterOfTheDay() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity, markLetterComplete } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const [taps, setTaps] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [letterBounce, setLetterBounce] = useState(false);

  const handleLetterTap = () => {
    setLetterBounce(true);
    setTimeout(() => setLetterBounce(false), 600);
    const newTaps = taps + 1;
    setTaps(newTaps);
    if (newTaps >= 3) {
      const key = `${ld.letter}-letter-of-the-day`;
      awardStars(key, 3);
      incrementActivity(key);
      markLetterComplete(ld.letter);
      setTimeout(() => setShowCelebration(true), 400);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center" style={{ background: ld.bgColor }}>
      {/* Top bar */}
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Letter of the Day</h2>
        <AudioButton onClick={() => {}} color={ld.color} />
      </div>

      {/* Buddy */}
      <BuddyBear mood="happy" size={100}
        speech={`This is the letter ${ld.uppercase}! It says "${ld.phoneme}" like ${ld.exampleWord}! Tap me ${Math.max(0, 3 - taps)} more times! 🎉`}
      />

      {/* Giant letter */}
      <motion.button
        onClick={handleLetterTap}
        animate={letterBounce ? { scale: [1, 1.25, 0.9, 1.1, 1], rotate: [0, -5, 5, -3, 0] } : { y: [0, -10, 0] }}
        transition={letterBounce ? { duration: 0.5 } : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="flex flex-col items-center mt-2"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div
          className="rounded-3xl flex flex-col items-center justify-center shadow-2xl"
          style={{ width: 200, height: 200, background: ld.color, position: 'relative' }}
        >
          <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '8rem', color: 'white', lineHeight: 1 }}>
            {ld.uppercase}
          </span>
        </div>
        <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '1.1rem', color: ld.color, marginTop: 8 }}>
          Tap to hear! ({taps}/3)
        </span>
      </motion.button>

      {/* Example word card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 card p-5 flex items-center gap-4 max-w-xs w-full mx-4"
        style={{ border: `3px solid ${ld.color}` }}
      >
        <span style={{ fontSize: '4rem' }}>{ld.exampleEmoji}</span>
        <div>
          <p style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '2rem', color: ld.color }}>
            <span style={{ color: ld.color, textDecoration: 'underline' }}>{ld.uppercase}</span>
            {ld.exampleWord.slice(1)}
          </p>
          <p style={{ fontFamily: 'Nunito', fontSize: '1rem', color: '#78716C' }}>
            {ld.phoneme} — {ld.exampleWord}
          </p>
        </div>
      </motion.div>

      {/* Fun fact */}
      {showFact && (
        <div className="p-4 w-full max-w-sm">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}

      <CelebrationScreen
        active={showCelebration}
        stars={3}
        message={`You know letter ${ld.uppercase}! 🎉`}
        onContinue={() => { setShowCelebration(false); setShowFact(true); }}
      />
    </div>
  );
}
