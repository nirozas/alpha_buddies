import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

export function LetterMatch() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  // Pick 3 random wrong letters + the correct one
  const allLetters = LETTERS_DATA.filter(l => l.letter !== ld.letter);
  const shuffled = [...allLetters].sort(() => Math.random() - 0.5).slice(0, 5);
  const [options] = useState(() => {
    const pool = [...allLetters].sort(() => Math.random() - 0.5).slice(0, 5);
    const combined = [...pool, ld].sort(() => Math.random() - 0.5);
    return combined;
  });

  const [selected, setSelected] = useState<string | null>(null);
  const [shake, setShake] = useState<string | null>(null);
  const [correct, setCorrect] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [round, setRound] = useState(0);

  const handleTap = (l: typeof ld) => {
    if (correct) return;
    if (l.letter === ld.letter) {
      setCorrect(l.letter);
      const stars: 1|2|3 = wrongCount === 0 ? 3 : wrongCount <= 1 ? 2 : 1;
      awardStars(`${ld.letter}-letter-match`, stars);
      incrementActivity(`${ld.letter}-letter-match`);
      setTimeout(() => setShowCelebration(true), 600);
    } else {
      setShake(l.letter);
      setWrongCount(w => w + 1);
      setTimeout(() => setShake(null), 600);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center" style={{ background: ld.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Letter Match</h2>
        <div style={{ width: 56 }} />
      </div>

      <BuddyBear mood={correct ? 'celebrating' : 'happy'} size={90}
        speech={`Find the picture that starts with the letter "${ld.uppercase}"! ${ld.exampleEmoji}`}
      />

      {/* Target letter */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="my-4 rounded-3xl flex items-center justify-center shadow-xl"
        style={{ width: 120, height: 120, background: ld.color }}
      >
        <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '5rem', color: 'white', lineHeight: 1 }}>
          {ld.uppercase}
        </span>
      </motion.div>

      <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '1.1rem', color: '#1C1917', marginBottom: 12 }}>
        Which picture starts with <span style={{ color: ld.color }}>{ld.uppercase}</span>?
      </p>

      {/* 6-card grid */}
      <div className="grid grid-cols-3 gap-3 px-4 w-full max-w-sm">
        {options.map((opt) => {
          const isCorrect = opt.letter === ld.letter;
          const isChosen = correct === opt.letter;
          return (
            <motion.button
              key={opt.letter}
              animate={shake === opt.letter ? { x: [-8, 8, -6, 6, 0] } :
                isChosen ? { scale: [1, 1.2, 1.1] } :
                { y: [0, -4, 0] }}
              transition={shake === opt.letter ? { duration: 0.4 } :
                isChosen ? { duration: 0.4 } :
                { repeat: Infinity, duration: 2 + Math.random(), ease: 'easeInOut', delay: Math.random() }}
              onClick={() => handleTap(opt)}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 shadow-md"
              style={{
                background: isChosen ? ld.color : 'white',
                border: `3px solid ${isChosen ? ld.color : '#E7E5E4'}`,
              }}
            >
              <span className="text-4xl">{opt.exampleEmoji}</span>
              <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.7rem', color: isChosen ? 'white' : '#78716C' }}>
                {opt.exampleWord}
              </span>
            </motion.button>
          );
        })}
      </div>

      {showFact && (
        <div className="p-4 w-full max-w-sm mt-4">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={wrongCount === 0 ? 3 : wrongCount <= 1 ? 2 : 1}
        message="You found it! 🎉"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
