import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface FallingLetter {
  id: number; letter: string; x: number; speed: number; color: string;
}

let gId = 0;

export function LetterCaterpillar() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const [segments, setSegments] = useState<string[]>([]);
  const [fallingLetters, setFallingLetters] = useState<FallingLetter[]>([]);
  const [nextIndex, setNextIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const GOAL = 6;

  // Spawn falling letters
  useEffect(() => {
    if (showCelebration) return;
    const interval = setInterval(() => {
      const shouldBeNext = Math.random() < 0.4;
      const letter = shouldBeNext && nextIndex < ALPHABET.length
        ? ALPHABET[nextIndex]
        : LETTERS_DATA[Math.floor(Math.random() * 26)].letter;
      const ld2 = LETTERS_DATA.find(l => l.letter === letter)!;
      setFallingLetters(f => [
        ...f.slice(-10),
        { id: gId++, letter, x: 5 + Math.random() * 80, speed: 3 + Math.random() * 2, color: ld2.color }
      ]);
    }, 1200);
    return () => clearInterval(interval);
  }, [nextIndex, showCelebration]);

  const handleTap = (fl: FallingLetter) => {
    if (fl.letter === ALPHABET[nextIndex]) {
      setFallingLetters(f => f.filter(x => x.id !== fl.id));
      setSegments(s => [...s, fl.letter]);
      const newIndex = nextIndex + 1;
      setNextIndex(newIndex);
      if (newIndex >= GOAL) {
        awardStars(`${ld.letter}-letter-caterpillar`, 3);
        incrementActivity(`${ld.letter}-letter-caterpillar`);
        setTimeout(() => setShowCelebration(true), 500);
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: ld.bgColor, position: 'relative', overflow: 'hidden' }}>
      <div className="w-full flex items-center justify-between p-4 relative z-10">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Letter Caterpillar</h2>
        <div style={{ width: 56 }} />
      </div>

      <BuddyBear mood="excited" size={80} speech={`Tap the letter "${ALPHABET[nextIndex]}" next! Make the caterpillar grow! 🐛`} className="relative z-10" />

      {/* Next letter hint */}
      <div className="flex justify-center mt-1 relative z-10">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow"
          style={{ background: ld.color, fontFamily: 'Nunito', color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>
          Tap: <span style={{ fontSize: '1.5rem' }}>{ALPHABET[nextIndex]}</span>
        </div>
      </div>

      {/* Caterpillar */}
      <motion.div
        animate={shake ? { x: [-8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center gap-1 mt-4 flex-wrap px-4 relative z-10"
      >
        {/* Head */}
        <motion.div
          animate={{ x: [0, 2, -2, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
          className="rounded-full flex items-center justify-center shadow-lg"
          style={{ width: 54, height: 54, background: ld.color, border: '3px solid white', fontSize: '1.8rem' }}
        >🐛</motion.div>
        {/* Segments */}
        <AnimatePresence>
          {segments.map((seg, i) => (
            <motion.div
              key={`${seg}-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="rounded-full flex items-center justify-center shadow-md"
              style={{ width: 46, height: 46, background: LETTERS_DATA[i % 26].color, border: '3px solid white' }}
            >
              <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.3rem', color: 'white' }}>{seg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Progress */}
      <p className="text-center mt-2 relative z-10" style={{ fontFamily: 'Nunito', fontWeight: 700, color: ld.color }}>
        {segments.length}/{GOAL} segments
      </p>

      {/* Falling letters */}
      {fallingLetters.map(fl => (
        <motion.button
          key={fl.id}
          initial={{ y: -60 }}
          animate={{ y: '100vh' }}
          transition={{ duration: fl.speed, ease: 'linear' }}
          onTap={() => handleTap(fl)}
          style={{
            position: 'absolute',
            left: `${fl.x}%`,
            top: 0,
            zIndex: 5,
            width: 56, height: 56,
            borderRadius: '50%',
            background: fl.color,
            border: '3px solid white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.4rem', color: 'white' }}>{fl.letter}</span>
        </motion.button>
      ))}

      {showFact && (
        <div className="absolute inset-x-4 bottom-8 z-20">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={3} message="Super caterpillar! 🐛🌟"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
