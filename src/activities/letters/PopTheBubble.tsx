import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

interface Bubble {
  id: number; letter: string; x: number; color: string; speed: number; size: number;
}

let idCounter = 0;
const randomLetter = () => LETTERS_DATA[Math.floor(Math.random() * 26)].letter;

export function PopTheBubble() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [popped, setPopped] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const GOAL = 5;

  // Spawn bubbles
  useEffect(() => {
    const interval = setInterval(() => {
      const newBubble: Bubble = {
        id: idCounter++,
        letter: Math.random() < 0.35 ? ld.letter : randomLetter(),
        x: 10 + Math.random() * 80,
        color: LETTERS_DATA[Math.floor(Math.random() * 26)].color,
        speed: 3 + Math.random() * 3,
        size: 60 + Math.random() * 30,
      };
      setBubbles(b => [...b.slice(-14), newBubble]);
    }, 1000);
    return () => clearInterval(interval);
  }, [ld.letter]);

  const handlePop = (bubble: Bubble) => {
    if (popped.includes(bubble.id)) return;
    if (bubble.letter === ld.letter) {
      setPopped(p => [...p, bubble.id]);
      const newScore = score + 1;
      setScore(newScore);
      if (newScore >= GOAL) {
        const key = `${ld.letter}-pop-the-bubble`;
        awardStars(key, 3);
        incrementActivity(key);
        setTimeout(() => setShowCelebration(true), 600);
      }
    } else {
      // Wrong bubble — shake effect via re-render
    }
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: ld.bgColor, overflow: 'hidden', position: 'relative' }}>
      <div className="w-full flex items-center justify-between p-4 relative z-10">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <div className="text-center">
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Pop the Bubble!</h2>
          <p style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1rem', color: ld.color }}>
            Pop: <span style={{ fontSize: '1.3rem' }}>{ld.uppercase}</span> — {score}/{GOAL}
          </p>
        </div>
        <div style={{ width: 56 }} />
      </div>

      <BuddyBear mood="excited" size={80} speech={`Pop the bubble with the letter "${ld.uppercase}"! 🫧`} className="relative z-10" />

      {/* Bubbles */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {bubbles.map((bubble) => (
          <motion.button
            key={bubble.id}
            initial={{ y: '100vh', opacity: 0.9, scale: 0.8 }}
            animate={popped.includes(bubble.id) ? { scale: 2, opacity: 0 } : { y: '-120vh', opacity: [0.9, 0.9, 0] }}
            transition={popped.includes(bubble.id) ? { duration: 0.3 } : { duration: bubble.speed, ease: 'linear' }}
            onClick={() => handlePop(bubble)}
            style={{
              position: 'absolute',
              left: `${bubble.x}%`,
              width: bubble.size,
              height: bubble.size,
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 35%, white, ${bubble.color}88)`,
              border: `3px solid ${bubble.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              pointerEvents: 'all',
              boxShadow: `inset -4px -4px 12px ${bubble.color}40, 0 2px 8px ${bubble.color}30`,
            }}
          >
            <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: bubble.size * 0.45, color: bubble.color }}>
              {bubble.letter}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Score dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {Array.from({ length: GOAL }).map((_, i) => (
          <motion.div
            key={i}
            animate={i < score ? { scale: [1, 1.4, 1] } : {}}
            className="rounded-full"
            style={{ width: 20, height: 20, background: i < score ? ld.color : ld.color + '30', border: `2px solid ${ld.color}` }}
          />
        ))}
      </div>

      {showFact && (
        <div className="absolute inset-0 flex items-end justify-center p-6 z-20">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={3} message={`Bubble popper! 🫧💥`}
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
